const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');
const path = require('path');

const supabase = createClient(
  'https://wdodhzqgmumrwgfihagc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzA4OTMsImV4cCI6MjA4NDAwNjg5M30.HBMlIvVSZzUtaCXsItllxrZiLVO_HbUgE4vnPvn861o'
);

const reviewFiles = [
  path.join('C:', 'Users', 'tjlar', 'Downloads', 'Cedar_Park_Restaurants_Reviews_Fixed.xlsx'),
  path.join('C:', 'Users', 'tjlar', 'Downloads', 'Leander_Restaurants_Reviews_Fixed.xlsx'),
  path.join('C:', 'Users', 'tjlar', 'Downloads', 'Liberty_Hill_Restaurants_Reviews_Fixed.xlsx')
];

async function importReviews() {
  let totalReviews = 0;
  let businessCount = 0;
  let notFound = 0;
  let duplicates = 0;

  for (const file of reviewFiles) {
    console.log(`\nProcessing: ${path.basename(file)}`);

    const workbook = XLSX.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log(`  Rows: ${data.length}`);

    for (const row of data) {
      const businessName = row['name'];

      if (!businessName) {
        continue;
      }

      // Get business ID from database
      const { data: bizResult, error: bizError } = await supabase
        .from('businesses')
        .select('id')
        .ilike('name', businessName)
        .limit(1)
        .maybeSingle();

      if (bizError || !bizResult) {
        notFound++;
        if (notFound <= 10) {
          console.log(`  Business not found: ${businessName}`);
        }
        continue;
      }

      const businessId = bizResult.id;
      businessCount++;

      // Import up to 10 reviews
      for (let num = 1; num <= 10; num++) {
        const author = row[`Review_${num}_author_title`];
        const rating = row[`Review_${num}_review_rating`];
        const text = row[`Review_${num}_review_text`];
        const dateStr = row[`Review_${num}_review_datetime_utc`];
        const link = row[`Review_${num}_review_link`];

        // Skip if no text
        if (!text || (typeof text === 'string' && text.trim() === '')) {
          continue;
        }

        // Parse rating
        let ratingNum = 5;
        if (rating !== undefined && rating !== null) {
          ratingNum = parseInt(rating) || 5;
          if (ratingNum < 1) ratingNum = 1;
          if (ratingNum > 5) ratingNum = 5;
        }

        // Parse date
        let reviewDate = null;
        if (dateStr) {
          try {
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) {
              reviewDate = d.toISOString();
            }
          } catch (e) {}
        }

        try {
          const { error: insertError } = await supabase
            .from('reviews')
            .insert({
              business_id: businessId,
              author_name: author && typeof author === 'string' ? author : 'Anonymous',
              rating: ratingNum,
              text: String(text).substring(0, 5000), // Limit text length
              review_date: reviewDate,
              likes: 0,
              source: 'google'
            });

          if (insertError) {
            if (insertError.code === '23505') {
              duplicates++;
            } else {
              // Other error
            }
          } else {
            totalReviews++;
          }
        } catch (err) {
          // Skip errors
        }
      }

      if (businessCount % 25 === 0) {
        console.log(`  Processed ${businessCount} businesses, ${totalReviews} reviews...`);
      }
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('REVIEWS IMPORT COMPLETE');
  console.log(`${'='.repeat(60)}`);
  console.log(`Businesses processed: ${businessCount}`);
  console.log(`Reviews imported: ${totalReviews}`);
  console.log(`Businesses not found: ${notFound}`);
  console.log(`Duplicates skipped: ${duplicates}`);

  // Verification
  console.log(`\n${'='.repeat(60)}`);
  console.log('VERIFICATION:');
  console.log(`${'='.repeat(60)}`);

  const { data: reviewStats, error } = await supabase
    .from('reviews')
    .select('id', { count: 'exact', head: true });

  console.log(`Total reviews in database: ${reviewStats ? 'checked' : 'error'}`);

  // Count by city
  const { data: cityStats } = await supabase
    .rpc('get_review_count_by_city');

  if (cityStats) {
    console.log('Reviews by city:', cityStats);
  }

  // Sample check
  const { data: sample } = await supabase
    .from('reviews')
    .select('author_name, rating, text, business_id')
    .order('created_at', { ascending: false })
    .limit(3);

  if (sample) {
    console.log('\nMost recent reviews:');
    for (const r of sample) {
      console.log(`  - ${r.author_name}: ${r.rating} stars - "${r.text?.substring(0, 50)}..."`);
    }
  }
}

importReviews().catch(console.error);
