const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scripts/hutto_test_raw.json', 'utf8'));

console.log('Total businesses:', data.length);
console.log('\n' + '='.repeat(60));
console.log('First business:', data[0].name);
console.log('='.repeat(60));

// Check photo field
console.log('\nPhoto field:', data[0].photo ? data[0].photo.substring(0, 80) + '...' : 'None');
console.log('Photos count field:', data[0].photos_count);

// Check for reviews data
console.log('\nReviews data:');
console.log('  reviews_data exists:', data[0].reviews_data ? 'YES' : 'NO');
console.log('  reviews_data length:', data[0].reviews_data ? data[0].reviews_data.length : 0);

if (data[0].reviews_data && data[0].reviews_data.length > 0) {
    console.log('\nFirst 3 reviews:');
    for (let i = 0; i < Math.min(3, data[0].reviews_data.length); i++) {
        const rev = data[0].reviews_data[i];
        console.log(`  ${i+1}. ${rev.author_title} - ${rev.review_rating} stars`);
        console.log(`     "${rev.review_text ? rev.review_text.substring(0, 60) : 'No text'}..."`);
    }
}

// Check for photos_data
console.log('\nphotos_data exists:', data[0].photos_data ? 'YES' : 'NO');
console.log('photos_data length:', data[0].photos_data ? data[0].photos_data.length : 0);

// List all keys that contain 'photo' or 'review'
const keys = Object.keys(data[0]);
console.log('\nPhoto-related keys:', keys.filter(k => k.toLowerCase().includes('photo')));
console.log('Review-related keys:', keys.filter(k => k.toLowerCase().includes('review')));

// Summary stats
console.log('\n' + '='.repeat(60));
console.log('SUMMARY STATS:');
console.log('='.repeat(60));

let with5Photos = 0;
let with10Reviews = 0;
let totalPhotos = 0;
let totalReviews = 0;

for (const biz of data) {
    const photoCount = biz.photos_data ? biz.photos_data.length : (biz.photo ? 1 : 0);
    const reviewCount = biz.reviews_data ? biz.reviews_data.length : 0;

    totalPhotos += photoCount;
    totalReviews += reviewCount;

    if (photoCount >= 5) with5Photos++;
    if (reviewCount >= 10) with10Reviews++;
}

console.log(`Businesses: ${data.length}`);
console.log(`With 5+ photos: ${with5Photos}/${data.length}`);
console.log(`With 10+ reviews: ${with10Reviews}/${data.length}`);
console.log(`Avg photos: ${(totalPhotos / data.length).toFixed(1)}`);
console.log(`Avg reviews: ${(totalReviews / data.length).toFixed(1)}`);
