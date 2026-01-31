/**
 * HUTTO TEST - PHASE 3: Import to Database
 * Import 20 Hutto businesses with their reviews
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

// Generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

// Generate review ID
function generateReviewId(author, text, businessId) {
  const str = `${author || ''}-${text?.substring(0, 100) || ''}-${businessId}`;
  return crypto.createHash('md5').update(str).digest('base64').substring(0, 30);
}

// Category mapping
function getCategory(subtypes) {
  if (!subtypes) return 'services';
  const s = subtypes.toLowerCase();
  if (s.includes('restaurant') || s.includes('food') || s.includes('cafe') || s.includes('coffee')) return 'restaurants';
  if (s.includes('salon') || s.includes('hair') || s.includes('beauty') || s.includes('spa')) return 'beauty';
  if (s.includes('gym') || s.includes('fitness')) return 'fitness';
  if (s.includes('dental') || s.includes('health') || s.includes('medical')) return 'health';
  if (s.includes('auto') || s.includes('car') || s.includes('repair')) return 'automotive';
  if (s.includes('pet') || s.includes('vet')) return 'pets';
  if (s.includes('bank') || s.includes('credit')) return 'financial';
  if (s.includes('grocery') || s.includes('store') || s.includes('shop')) return 'shopping';
  return 'services';
}

// Parse hours
function parseHours(workingHours) {
  if (!workingHours) return null;

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const hours = {};

  for (const day of days) {
    const dayHours = workingHours[day.charAt(0).toUpperCase() + day.slice(1)];
    if (dayHours) {
      if (dayHours === 'Closed' || dayHours.toLowerCase().includes('closed')) {
        hours[day] = { isOpen: false, open: '', close: '' };
      } else {
        // Try to parse "9 AM–9 PM" format
        const match = dayHours.match(/(\d+(?::\d+)?\s*[AP]M)\s*[–-]\s*(\d+(?::\d+)?\s*[AP]M)/i);
        if (match) {
          hours[day] = { isOpen: true, open: match[1], close: match[2] };
        } else {
          hours[day] = { isOpen: true, open: dayHours, close: '' };
        }
      }
    } else {
      hours[day] = { isOpen: false, open: '', close: '' };
    }
  }

  return hours;
}

async function importBusinesses() {
  console.log('='.repeat(60));
  console.log('IMPORTING HUTTO BUSINESSES TO DATABASE');
  console.log('='.repeat(60));

  // First, get the location_id for a Williamson County location
  // (We'll use Leander's location_id since Hutto is also in WilCo)
  const { data: location } = await supabase
    .from('locations')
    .select('id')
    .eq('slug', 'leander')
    .single();

  if (!location) {
    console.log('ERROR: Could not find location');
    return;
  }

  console.log(`Using location_id: ${location.id}`);

  const importedBusinesses = [];
  let totalReviews = 0;
  let errors = [];

  for (const biz of rawData) {
    // Only import Hutto businesses
    if (biz.city !== 'Hutto') {
      console.log(`  Skipping ${biz.name} - City: ${biz.city}`);
      continue;
    }

    const slug = generateSlug(biz.name);
    const category = getCategory(biz.subtypes);

    // Check if business already exists
    const { data: existing } = await supabase
      .from('businesses')
      .select('id, slug')
      .eq('slug', slug)
      .maybeSingle();

    if (existing) {
      console.log(`  Already exists: ${biz.name} (${slug})`);
      continue;
    }

    // Prepare photos array (just main photo for now)
    const photos = biz.photo ? [biz.photo] : [];

    // Prepare business data
    const businessData = {
      location_id: location.id,
      slug: slug,
      name: biz.name,
      description: biz.description || `${biz.name} is a local business in Hutto, TX.`,
      category: category,
      subcategory: biz.subtypes || category,
      image: biz.photo || null,
      photos: photos,
      phone: biz.phone || null,
      website: biz.website || null,
      address_street: biz.address ? biz.address.split(',')[0] : null,
      address_city: 'Hutto',
      address_state: 'TX',
      address_zip: biz.postal_code || null,
      latitude: biz.latitude || null,
      longitude: biz.longitude || null,
      hours: parseHours(biz.working_hours),
      rating: biz.rating || 0,
      review_count: biz.reviews || 0,
      listing_tier: 'free',
      is_featured: false,
      tags: [category, biz.subtypes, 'Hutto'].filter(Boolean)
    };

    try {
      // Insert business
      const { data: inserted, error: insertError } = await supabase
        .from('businesses')
        .insert(businessData)
        .select('id, slug, name')
        .single();

      if (insertError) {
        errors.push(`${biz.name}: ${insertError.message}`);
        console.log(`  ERROR: ${biz.name} - ${insertError.message}`);
        continue;
      }

      console.log(`  Imported: ${biz.name}`);
      console.log(`    Slug: ${inserted.slug}`);
      console.log(`    Photos: ${photos.length}`);

      // Import reviews
      let reviewCount = 0;
      if (biz.reviews_data && biz.reviews_data.length > 0) {
        for (const rev of biz.reviews_data.slice(0, 10)) {
          const reviewId = rev.review_id || generateReviewId(rev.author_title, rev.review_text, inserted.id);

          const reviewData = {
            business_id: inserted.id,
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
            }
          } catch (e) {
            // Skip duplicate reviews
          }
        }
      }

      console.log(`    Reviews: ${reviewCount}`);
      totalReviews += reviewCount;

      importedBusinesses.push({
        name: biz.name,
        id: inserted.id,
        slug: inserted.slug,
        photos: photos.length,
        reviews: reviewCount,
        url: `https://directory.leanderscoop.com/business/${inserted.slug}`
      });

    } catch (err) {
      errors.push(`${biz.name}: ${err.message}`);
      console.log(`  ERROR: ${biz.name} - ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('IMPORT COMPLETE');
  console.log('='.repeat(60));
  console.log(`Businesses imported: ${importedBusinesses.length}`);
  console.log(`Reviews imported: ${totalReviews}`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(e => console.log(`  - ${e}`));
  }

  // Save results
  const resultsFile = path.join(__dirname, 'hutto_import_results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(importedBusinesses, null, 2));
  console.log(`\nResults saved to: ${resultsFile}`);

  // Print URLs for verification
  console.log('\n' + '='.repeat(60));
  console.log('VERIFICATION LINKS FOR TJ');
  console.log('='.repeat(60));
  console.log('\nThese are the NEW Hutto businesses:');

  for (let i = 0; i < importedBusinesses.length; i++) {
    const biz = importedBusinesses[i];
    console.log(`\n${i + 1}. ${biz.name}`);
    console.log(`   ${biz.url}`);
    console.log(`   Photos: ${biz.photos} | Reviews: ${biz.reviews}`);
  }
}

importBusinesses().catch(console.error);
