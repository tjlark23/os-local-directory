const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Supabase config
const supabaseUrl = 'https://wdodhzqgmumrwgfihagc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzA4OTMsImV4cCI6MjA4NDAwNjg5M30.HBMlIvVSZzUtaCXsItllxrZiLVO_HbUgE4vnPvn861o';
const supabase = createClient(supabaseUrl, supabaseKey);

// Create a URL-friendly slug
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

// Normalize city name to match location data
function normalizeCity(city) {
  if (!city) return null;
  const c = city.toLowerCase().trim();
  if (c.includes('leander')) return 'Leander';
  if (c.includes('cedar park')) return 'Cedar Park';
  if (c.includes('liberty hill')) return 'Liberty Hill';
  if (c.includes('austin')) return 'Austin';
  if (c.includes('round rock')) return 'Round Rock';
  if (c.includes('georgetown')) return 'Georgetown';
  if (c.includes('pflugerville')) return 'Pflugerville';
  return city; // Return original if not a known city
}

// Parse hours from OutScraper JSON format
function parseHours(hoursStr) {
  const defaultHours = {
    monday: { isOpen: false },
    tuesday: { isOpen: false },
    wednesday: { isOpen: false },
    thursday: { isOpen: false },
    friday: { isOpen: false },
    saturday: { isOpen: false },
    sunday: { isOpen: false }
  };

  if (!hoursStr || typeof hoursStr !== 'string') return defaultHours;

  try {
    const hours = JSON.parse(hoursStr);
    const result = { ...defaultHours };

    for (const [day, times] of Object.entries(hours)) {
      const dayLower = day.toLowerCase();
      if (result[dayLower] !== undefined) {
        if (Array.isArray(times) && times.length > 0 && times[0] !== 'Closed') {
          result[dayLower] = { isOpen: true, hours: times.join(', ') };
        }
      }
    }

    return result;
  } catch (e) {
    return defaultHours;
  }
}

// Clean description text
function cleanDescription(desc, about, name, city) {
  // First try description field
  if (desc && typeof desc === 'string' && !desc.startsWith('{') && !desc.startsWith('[') && desc.length > 10) {
    return desc.substring(0, 500);
  }
  // Then try about field
  if (about && typeof about === 'string' && !about.startsWith('{') && !about.startsWith('[') && about.length > 10) {
    return about.substring(0, 500);
  }
  // Default description
  return `${name} is a local restaurant in ${city || 'the area'}, TX.`;
}

// Extract tags from about JSON if present
function extractTags(aboutStr, subtypes) {
  const tags = [];

  // Try to extract from subtypes first
  if (subtypes && typeof subtypes === 'string') {
    const parts = subtypes.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0 && s.length < 30);
    tags.push(...parts.slice(0, 5));
  }

  // Try to extract service options from about JSON
  if (aboutStr && typeof aboutStr === 'string') {
    try {
      const about = JSON.parse(aboutStr);
      if (about['Service options']) {
        for (const [key, value] of Object.entries(about['Service options'])) {
          if (value === true && tags.length < 10) {
            tags.push(key.toLowerCase());
          }
        }
      }
      if (about['Highlights']) {
        for (const [key, value] of Object.entries(about['Highlights'])) {
          if (value === true && tags.length < 10) {
            tags.push(key.toLowerCase());
          }
        }
      }
    } catch (e) {
      // Not valid JSON, ignore
    }
  }

  return [...new Set(tags)].slice(0, 10); // Dedupe and limit to 10
}

async function importRestaurants() {
  console.log('Starting restaurant import...\n');

  // Get location ID for Leander (main location covering all cities)
  const { data: location, error: locError } = await supabase
    .from('locations')
    .select('id')
    .eq('slug', 'leander')
    .single();

  if (locError || !location) {
    console.error('Could not find leander location:', locError);
    return;
  }

  const locationId = location.id;
  console.log('Location ID:', locationId);

  // Path to the restaurant data folder
  const dataFolder = 'C:/Users/TJ/OneDrive/Desktop/AI Apps/Local Directory/Restaurant Data 1-2026';

  // Read all Excel files in the folder
  const files = fs.readdirSync(dataFolder).filter(f => f.endsWith('.xlsx'));
  console.log(`Found ${files.length} Excel files:\n${files.map(f => '  - ' + f).join('\n')}\n`);

  let allBusinesses = [];
  const seenSlugs = new Set();
  const seenNames = new Set(); // Track by name to avoid duplicates

  for (const file of files) {
    const filePath = path.join(dataFolder, file);
    console.log(`Processing: ${file}`);

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log(`  Found ${data.length} rows`);

    let validRows = 0;
    let skippedDupes = 0;
    let skippedInvalid = 0;

    for (const row of data) {
      // Skip if no name or closed businesses
      if (!row.name || row.business_status === 'CLOSED_PERMANENTLY') {
        skippedInvalid++;
        continue;
      }

      // Normalize and filter cities
      const city = normalizeCity(row.city);
      const validCities = ['Leander', 'Cedar Park', 'Liberty Hill', 'Austin', 'Round Rock', 'Georgetown', 'Pflugerville'];
      if (!city || !validCities.includes(city)) {
        skippedInvalid++;
        continue;
      }

      // Check for duplicate names (case-insensitive)
      const normalizedName = row.name.toLowerCase().trim();
      if (seenNames.has(normalizedName)) {
        skippedDupes++;
        continue;
      }
      seenNames.add(normalizedName);

      // Create unique slug
      let slug = createSlug(row.name);
      if (seenSlugs.has(slug)) {
        slug = slug + '-' + city.toLowerCase().replace(/\s+/g, '-');
      }
      if (seenSlugs.has(slug)) {
        slug = slug + '-' + Math.random().toString(36).substring(2, 6);
      }
      seenSlugs.add(slug);

      const business = {
        location_id: locationId,
        slug: slug,
        name: row.name.substring(0, 255),
        description: cleanDescription(row.description, row.about, row.name, city),
        category: 'restaurants', // All are restaurants for this import
        subcategory: row.subtypes ? row.subtypes.split(',')[0].trim().substring(0, 100) : 'Restaurant',
        image: row.photo || '/images/placeholders/restaurant.svg',
        photos: row.photo ? [row.photo] : [],
        phone: row.phone ? String(row.phone).substring(0, 20) : null,
        email: null,
        website: row.website || null,
        address_street: row.street || 'Address not available',
        address_city: city,
        address_state: row.state_code || 'TX',
        address_zip: row.postal_code ? String(row.postal_code).substring(0, 10) : '78641',
        latitude: row.latitude || null,
        longitude: row.longitude || null,
        hours: parseHours(row.working_hours),
        rating: row.rating ? Math.min(5, Math.max(0, parseFloat(row.rating))) : 0,
        review_count: row.reviews ? parseInt(row.reviews) : 0,
        price_range: row.range || null,
        specialties: row.subtypes ? row.subtypes.split(',').map(s => s.trim()).slice(0, 10) : [],
        tags: extractTags(row.about, row.subtypes),
        listing_tier: 'free',
        is_featured: false,
        backlink_enabled: false
      };

      allBusinesses.push(business);
      validRows++;
    }

    console.log(`  Processed: ${validRows} valid, ${skippedDupes} dupes, ${skippedInvalid} invalid\n`);
  }

  console.log(`\nTotal unique restaurants to import: ${allBusinesses.length}`);

  // Count by city
  const cityCounts = {};
  for (const biz of allBusinesses) {
    cityCounts[biz.address_city] = (cityCounts[biz.address_city] || 0) + 1;
  }
  console.log('\nBy city:');
  for (const [city, count] of Object.entries(cityCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${city}: ${count}`);
  }

  // Import in batches of 100
  const batchSize = 100;
  let imported = 0;
  let errors = 0;

  console.log('\nImporting to Supabase...');

  for (let i = 0; i < allBusinesses.length; i += batchSize) {
    const batch = allBusinesses.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from('businesses')
      .insert(batch);

    if (error) {
      console.error(`Error importing batch ${i}-${i+batchSize}:`, error.message);
      errors += batch.length;
    } else {
      imported += batch.length;
    }

    // Progress update
    process.stdout.write(`\r  Progress: ${Math.min(i + batchSize, allBusinesses.length)}/${allBusinesses.length}`);
  }

  console.log(`\n\nImport complete!`);
  console.log(`Successfully imported: ${imported}`);
  console.log(`Errors: ${errors}`);
}

importRestaurants().catch(console.error);
