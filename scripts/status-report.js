const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://wdodhzqgmumrwgfihagc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzA4OTMsImV4cCI6MjA4NDAwNjg5M30.HBMlIvVSZzUtaCXsItllxrZiLVO_HbUgE4vnPvn861o'
);

async function getStats() {
  console.log('Gathering database statistics...\n');

  // Get all businesses
  const { data: allBiz } = await supabase.from('businesses').select('id, address_city, photos, rating, review_count, listing_tier');

  // Photo stats
  let with5Photos = 0;
  let with1Photo = 0;
  let withNoPhotos = 0;

  // City stats
  const cityStats = {};

  for (const biz of allBiz || []) {
    const city = biz.address_city || 'Unknown';
    if (!cityStats[city]) {
      cityStats[city] = { total: 0, with5Photos: 0, withReviewCount: 0 };
    }
    cityStats[city].total++;

    const photoCount = biz.photos && Array.isArray(biz.photos) ? biz.photos.length : 0;
    if (photoCount >= 5) {
      with5Photos++;
      cityStats[city].with5Photos++;
    } else if (photoCount >= 1) {
      with1Photo++;
    } else {
      withNoPhotos++;
    }

    if (biz.review_count > 0) {
      cityStats[city].withReviewCount++;
    }
  }

  // Count actual reviews per city
  for (const city of Object.keys(cityStats)) {
    const bizIds = allBiz.filter(b => b.address_city === city).map(b => b.id);

    let reviewCount = 0;
    for (const id of bizIds.slice(0, 100)) { // Sample first 100
      const { count } = await supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('business_id', id);
      reviewCount += count || 0;
    }
    cityStats[city].actualReviews = reviewCount;
  }

  // Get listing tier breakdown
  const tierStats = { free: 0, premium: 0, featured: 0 };
  for (const biz of allBiz || []) {
    const tier = biz.listing_tier || 'free';
    tierStats[tier] = (tierStats[tier] || 0) + 1;
  }

  console.log('='.repeat(60));
  console.log('DATABASE STATISTICS');
  console.log('='.repeat(60));
  console.log('\nTotal Businesses:', allBiz.length);
  console.log('\nPhoto Distribution:');
  console.log('  With 5+ photos:', with5Photos);
  console.log('  With 1-4 photos:', with1Photo);
  console.log('  With 0 photos:', withNoPhotos);
  console.log('\nListing Tiers:');
  console.log('  Free:', tierStats.free);
  console.log('  Premium:', tierStats.premium);
  console.log('  Featured:', tierStats.featured);

  console.log('\n' + '='.repeat(60));
  console.log('STATS BY CITY');
  console.log('='.repeat(60));

  // Sort by total count
  const sortedCities = Object.entries(cityStats).sort((a, b) => b[1].total - a[1].total);

  for (const [city, stats] of sortedCities) {
    if (stats.total < 5) continue; // Skip very small cities
    console.log(`\n${city}:`);
    console.log(`  Total: ${stats.total}`);
    console.log(`  With 5+ photos: ${stats.with5Photos}`);
    console.log(`  With review_count > 0: ${stats.withReviewCount}`);
    console.log(`  Actual reviews (sampled): ${stats.actualReviews}`);
  }
}

getStats().catch(console.error);
