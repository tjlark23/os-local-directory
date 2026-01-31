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
  let alreadyHasPhotos = 0;
  let errors = [];

  for (const [placeId, data] of Object.entries(photosData)) {
    const photos = data.combined_photos;

    if (!photos || photos.length === 0) {
      continue;
    }

    try {
      // Find business by name and city
      const { data: existingBiz, error: findError } = await supabase
        .from('businesses')
        .select('id, name, address_city, photos')
        .ilike('name', data.name)
        .ilike('address_city', data.city)
        .maybeSingle();

      if (findError) {
        // Try without city match if that fails
        const { data: bizByName, error: nameError } = await supabase
          .from('businesses')
          .select('id, name, photos')
          .ilike('name', data.name)
          .limit(1)
          .maybeSingle();

        if (!bizByName) {
          notFound++;
          if (notFound <= 10) {
            console.log(`  Not found: ${data.name} (${data.city})`);
          }
          continue;
        }

        // Check if already has multiple photos
        if (bizByName.photos && bizByName.photos.length >= 3) {
          alreadyHasPhotos++;
          continue;
        }

        // Update
        const { error: updateError } = await supabase
          .from('businesses')
          .update({
            photos: photos,
            image: photos[0]
          })
          .eq('id', bizByName.id);

        if (updateError) {
          errors.push(`Update error for ${data.name}: ${updateError.message}`);
        } else {
          updated++;
        }
      } else if (!existingBiz) {
        notFound++;
        if (notFound <= 10) {
          console.log(`  Not found: ${data.name} (${data.city})`);
        }
      } else {
        // Check if already has multiple photos
        if (existingBiz.photos && existingBiz.photos.length >= 3) {
          alreadyHasPhotos++;
          continue;
        }

        // Update
        const { error: updateError } = await supabase
          .from('businesses')
          .update({
            photos: photos,
            image: photos[0]
          })
          .eq('id', existingBiz.id);

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
  console.log(`Already had 3+ photos: ${alreadyHasPhotos}`);
  console.log(`Not found in DB: ${notFound}`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\nFirst 5 errors:');
    errors.slice(0, 5).forEach(e => console.log(`  - ${e}`));
  }

  // Verify - count businesses by photo count
  console.log(`\n${'='.repeat(60)}`);
  console.log('VERIFICATION:');
  console.log(`${'='.repeat(60)}`);

  const { data: allBiz } = await supabase
    .from('businesses')
    .select('name, address_city, photos');

  if (allBiz) {
    let with5 = 0, with3to4 = 0, with2 = 0, with1 = 0, with0 = 0;

    for (const biz of allBiz) {
      const count = Array.isArray(biz.photos) ? biz.photos.length : 0;
      if (count >= 5) with5++;
      else if (count >= 3) with3to4++;
      else if (count === 2) with2++;
      else if (count === 1) with1++;
      else with0++;
    }

    console.log(`Total businesses: ${allBiz.length}`);
    console.log(`With 5+ photos: ${with5}`);
    console.log(`With 3-4 photos: ${with3to4}`);
    console.log(`With 2 photos: ${with2}`);
    console.log(`With 1 photo: ${with1}`);
    console.log(`With 0 photos: ${with0}`);
  }

  // Show sample
  const { data: verifyData } = await supabase
    .from('businesses')
    .select('name, address_city, photos')
    .gte('photos', '[]')
    .limit(5);

  if (verifyData) {
    console.log('\nSample businesses:');
    for (const biz of verifyData) {
      const photoCount = Array.isArray(biz.photos) ? biz.photos.length : 0;
      console.log(`  ${biz.name} (${biz.address_city}): ${photoCount} photos`);
    }
  }
}

updatePhotos().catch(console.error);
