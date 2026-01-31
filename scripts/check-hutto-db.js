const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://wdodhzqgmumrwgfihagc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzA4OTMsImV4cCI6MjA4NDAwNjg5M30.HBMlIvVSZzUtaCXsItllxrZiLVO_HbUgE4vnPvn861o'
);

async function check() {
    // Count Hutto businesses
    const { data: huttoBiz, error } = await supabase
        .from('businesses')
        .select('id, name, slug, photos, address_city')
        .eq('address_city', 'Hutto');

    console.log('='.repeat(60));
    console.log('HUTTO BUSINESSES IN DATABASE');
    console.log('='.repeat(60));
    console.log('Total Hutto businesses:', huttoBiz ? huttoBiz.length : 0);

    // Count reviews for Hutto businesses
    let totalReviews = 0;
    let bizWithReviews = 0;
    let bizWith5Photos = 0;

    const results = [];

    for (const biz of huttoBiz || []) {
        const { count } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .eq('business_id', biz.id);

        const reviewCount = count || 0;
        const photoCount = biz.photos && Array.isArray(biz.photos) ? biz.photos.length : 0;

        if (reviewCount > 0) bizWithReviews++;
        if (photoCount >= 5) bizWith5Photos++;
        totalReviews += reviewCount;

        results.push({
            name: biz.name,
            slug: biz.slug,
            photos: photoCount,
            reviews: reviewCount
        });
    }

    console.log('With reviews:', bizWithReviews);
    console.log('With 5+ photos:', bizWith5Photos);
    console.log('Total reviews:', totalReviews);

    // Sort by reviews descending
    results.sort((a, b) => b.reviews - a.reviews);

    // Show top 10
    console.log('\n' + '='.repeat(60));
    console.log('TOP 10 HUTTO BUSINESSES (by review count)');
    console.log('='.repeat(60));

    for (let i = 0; i < Math.min(10, results.length); i++) {
        const biz = results[i];
        console.log(`\n${i + 1}. ${biz.name}`);
        console.log(`   Photos: ${biz.photos} | Reviews: ${biz.reviews}`);
        console.log(`   URL: https://directory.leanderscoop.com/business/${biz.slug}`);
    }
}

check().catch(console.error);
