/**
 * HUTTO TEST - Import reviews to EXISTING businesses
 * The businesses already exist, we just need to add reviews
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const supabase = createClient(
  'https://wdodhzqgmumrwgfihagc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzA4OTMsImV4cCI6MjA4NDAwNjg5M30.HBMlIvVSZzUtaCXsItllxrZiLVO_HbUgE4vnPvn861o'
);

// Load raw data
const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, 'hutto_test_raw.json'), 'utf8'));

// Generate review ID
function generateReviewId(author, text, businessId) {
  const str = `${author || ''}-${text?.substring(0, 100) || ''}-${businessId}`;
  return crypto.createHash('md5').update(str).digest('base64').substring(0, 30);
}

async function importReviews() {
  console.log('='.repeat(60));
  console.log('IMPORTING REVIEWS TO EXISTING HUTTO BUSINESSES');
  console.log('='.repeat(60));

  const results = [];
  let totalReviews = 0;
  let businessesUpdated = 0;

  for (const biz of rawData) {
    if (biz.city !== 'Hutto') continue;

    console.log(`\nProcessing: ${biz.name}`);

    // Find matching business in database by name
    const { data: existing, error: findError } = await supabase
      .from('businesses')
      .select('id, slug, name')
      .ilike('name', biz.name)
      .maybeSingle();

    if (!existing) {
      console.log(`  Not found in database`);
      continue;
    }

    console.log(`  Found: ${existing.slug}`);

    // Check if already has reviews
    const { count: existingReviewCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', existing.id);

    console.log(`  Existing reviews: ${existingReviewCount || 0}`);

    // Import reviews
    let reviewCount = 0;
    if (biz.reviews_data && biz.reviews_data.length > 0) {
      for (const rev of biz.reviews_data.slice(0, 10)) {
        const reviewId = rev.review_id || generateReviewId(rev.author_title, rev.review_text, existing.id);

        const reviewData = {
          business_id: existing.id,
          author_name: rev.author_title || 'Anonymous',
          author_id: rev.author_id || null,
          author_image: rev.author_image || null,
          author_link: rev.author_link || null,
          rating: rev.review_rating || 5,
          text: rev.review_text || '',
          review_date: rev.review_datetime_utc || null,
          review_timestamp: rev.review_timestamp || null,
          review_id: reviewId,
          review_link: rev.review_link || null,
          likes: rev.review_likes || 0,
          source: 'google'
        };

        try {
          const { error: revError } = await supabase
            .from('reviews')
            .insert(reviewData);

          if (!revError) {
            reviewCount++;
          } else if (revError.code === '23505') {
            // Duplicate - already exists
          } else {
            console.log(`    Review error: ${revError.message}`);
          }
        } catch (e) {
          // Skip
        }
      }
    }

    console.log(`  Imported ${reviewCount} new reviews`);
    totalReviews += reviewCount;

    if (reviewCount > 0) {
      businessesUpdated++;
      results.push({
        name: biz.name,
        slug: existing.slug,
        newReviews: reviewCount,
        url: `https://directory.leanderscoop.com/business/${existing.slug}`
      });
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('IMPORT COMPLETE');
  console.log('='.repeat(60));
  console.log(`Businesses updated: ${businessesUpdated}`);
  console.log(`Total new reviews: ${totalReviews}`);

  // Print URLs for verification
  console.log('\n' + '='.repeat(60));
  console.log('VERIFICATION LINKS FOR TJ');
  console.log('='.repeat(60));

  for (let i = 0; i < results.length; i++) {
    const biz = results[i];
    console.log(`\n${i + 1}. ${biz.name}`);
    console.log(`   ${biz.url}`);
    console.log(`   New reviews added: ${biz.newReviews}`);
  }

  return results;
}

importReviews().catch(console.error);
