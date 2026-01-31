const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');
const path = require('path');

const supabase = createClient(
  'https://wdodhzqgmumrwgfihagc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzA4OTMsImV4cCI6MjA4NDAwNjg5M30.HBMlIvVSZzUtaCXsItllxrZiLVO_HbUgE4vnPvn861o'
);

const photoFiles = [
  'C:\\Users\\tjlar\\Downloads\\Cedar_Park_Restaurants_Photos_Fixed.xlsx',
  'C:\\Users\\tjlar\\Downloads\\Leander General Restaurants + Photos_FIXED.xlsx',
  'C:\\Users\\tjlar\\Downloads\\Liberty_Hill_Restaurants_Photos_Fixed.xlsx'
];

async function importPhotos() {
  let updated = 0;
  let notFound = 0;
  let skipped = 0;

  for (const file of photoFiles) {
    console.log(`\nProcessing: ${path.basename(file)}`);

    const workbook = XLSX.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log(`  Rows: ${data.length}`);

    for (const row of data) {
      const businessName = row['name'];

      if (!businessName) {
        skipped++;
        continue;
      }

      // Extract photos from Photo_1_URL through Photo_10_URL (or more)
      const photos = [];
      for (let i = 1; i <= 60; i++) {
        const photoUrl = row[`Photo_${i}_URL`];
        if (photoUrl && typeof photoUrl === 'string' && photoUrl.startsWith('http')) {
          photos.push(photoUrl);
        }
        if (photos.length >= 5) break; // Only need first 5
      }

      if (photos.length === 0) {
        skipped++;
        continue;
      }

      try {
        // Update by matching name (case-insensitive)
        const { data: result, error } = await supabase
          .from('businesses')
          .update({
            photos: photos,
            image: photos[0]
          })
          .ilike('name', businessName)
          .select('id, name');

        if (error) {
          console.log(`  Error for ${businessName}: ${error.message}`);
          continue;
        }

        if (result && result.length > 0) {
          updated++;
          if (updated % 25 === 0) {
            console.log(`  Updated ${updated} businesses...`);
          }
        } else {
          notFound++;
          if (notFound <= 10) {
            console.log(`  Not found: ${businessName}`);
          }
        }
      } catch (err) {
        console.log(`  Error: ${err.message}`);
      }
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('PHOTOS IMPORT COMPLETE');
  console.log(`${'='.repeat(60)}`);
  console.log(`Updated: ${updated}`);
  console.log(`Not found: ${notFound}`);
  console.log(`Skipped (no photos): ${skipped}`);

  // Verification
  console.log(`\n${'='.repeat(60)}`);
  console.log('VERIFICATION:');
  console.log(`${'='.repeat(60)}`);

  const { data: stats } = await supabase
    .from('businesses')
    .select('address_city, photos')
    .in('address_city', ['Cedar Park', 'Leander', 'Liberty Hill']);

  if (stats) {
    const byCIty = {};
    for (const biz of stats) {
      const city = biz.address_city || 'Unknown';
      if (!byCIty[city]) {
        byCIty[city] = { total: 0, hasPhotos: 0, photoCount: 0 };
      }
      byCIty[city].total++;
      if (biz.photos && Array.isArray(biz.photos) && biz.photos.length > 0) {
        byCIty[city].hasPhotos++;
        byCIty[city].photoCount += biz.photos.length;
      }
    }

    for (const [city, data] of Object.entries(byCIty)) {
      const avgPhotos = data.hasPhotos > 0 ? (data.photoCount / data.hasPhotos).toFixed(1) : 0;
      console.log(`${city}: ${data.hasPhotos}/${data.total} have photos, avg ${avgPhotos} photos`);
    }
  }
}

importPhotos().catch(console.error);
