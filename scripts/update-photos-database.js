const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://wdodhzqgmumrwgfihagc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzA4OTMsImV4cCI6MjA4NDAwNjg5M30.HBMlIvVSZzUtaCXsItllxrZiLVO_HbUgE4vnPvn861o'
);

async function updatePhotos() {
  // Load extracted photos
  const photosData = JSON.parse(fs.readFileSync('scripts/extracted_photos.json', 'utf8'));

  console.log(`Loaded ${Object.keys(photosData).length} businesses with photos`);

  let updated = 0;
  let notFound = 0;
  let errors = [];

  for (const [placeId, data] of Object.entries(photosData)) {
    const photos = data.combined_photos;

    if (!photos || photos.length === 0) {
      continue;
    }

    try {
      // First, find business by place_id
      const { data: existingBiz, error: findError } = await supabase
        .from('businesses')
        .select('id, name, place_id')
        .eq('place_id', placeId)
        .maybeSingle();

      if (findError) {
        errors.push(`Find error for ${data.name}: ${findError.message}`);
        continue;
      }

      if (!existingBiz) {
        // Try finding by name if place_id not found
        const { data: bizByName, error: nameError } = await supabase
          .from('businesses')
          .select('id, name, place_id')
          .ilike('name', data.name)
          .limit(1)
          .maybeSingle();

        if (!bizByName) {
          notFound++;
          if (notFound <= 10) {
            console.log(`  Not found: ${data.name} (place_id: ${placeId})`);
          }
          continue;
        }

        // Update by ID instead
        const { error: updateError } = await supabase
          .from('businesses')
          .update({
            photos: photos,
            image: photos[0]  // Set primary image
          })
          .eq('id', bizByName.id);

        if (updateError) {
          errors.push(`Update error for ${data.name}: ${updateError.message}`);
        } else {
          updated++;
        }
      } else {
        // Update by place_id
        const { error: updateError } = await supabase
          .from('businesses')
          .update({
            photos: photos,
            image: photos[0]  // Set primary image
          })
          .eq('place_id', placeId);

        if (updateError) {
          errors.push(`Update error for ${data.name}: ${updateError.message}`);
        } else {
          updated++;
        }
      }

      if (updated % 20 === 0 && updated > 0) {
        console.log(`  Updated ${updated} businesses...`);
      }

    } catch (err) {
      errors.push(`${data.name}: ${err.message}`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('UPDATE COMPLETE');
  console.log(`${'='.repeat(60)}`);
  console.log(`Updated: ${updated}`);
  console.log(`Not found in DB: ${notFound}`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\nFirst 5 errors:');
    errors.slice(0, 5).forEach(e => console.log(`  - ${e}`));
  }

  // Verify
  console.log(`\n${'='.repeat(60)}`);
  console.log('VERIFICATION:');
  console.log(`${'='.repeat(60)}`);

  const { data: verifyData } = await supabase
    .from('businesses')
    .select('name, address_city, photos, image')
    .not('photos', 'is', null)
    .limit(5);

  if (verifyData) {
    for (const biz of verifyData) {
      const photoCount = Array.isArray(biz.photos) ? biz.photos.length : 0;
      console.log(`${biz.name} (${biz.address_city}): ${photoCount} photos`);
    }
  }
}

updatePhotos().catch(console.error);
