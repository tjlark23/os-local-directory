const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');

// Supabase config
const supabaseUrl = 'https://wdodhzqgmumrwgfihagc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzA4OTMsImV4cCI6MjA4NDAwNjg5M30.HBMlIvVSZzUtaCXsItllxrZiLVO_HbUgE4vnPvn861o';
const supabase = createClient(supabaseUrl, supabaseKey);

// Category mapping from OutScraper categories to our standard categories
function mapCategory(category, subtypes) {
  const cat = (category || '').toLowerCase();
  const sub = (subtypes || '').toLowerCase();

  if (cat.includes('restaurant') || cat.includes('food') || cat.includes('cafe') || cat.includes('coffee') ||
      cat.includes('bakery') || cat.includes('bar') || cat.includes('pizza') || cat.includes('grill') ||
      sub.includes('restaurant') || sub.includes('food')) {
    return 'restaurants';
  }
  if (cat.includes('doctor') || cat.includes('dentist') || cat.includes('medical') || cat.includes('hospital') ||
      cat.includes('clinic') || cat.includes('pharmacy') || cat.includes('health') || cat.includes('wellness') ||
      cat.includes('spa') || cat.includes('chiropractor') || cat.includes('therapist') ||
      sub.includes('medical') || sub.includes('health') || sub.includes('dental')) {
    return 'health';
  }
  if (cat.includes('beauty') || cat.includes('salon') || cat.includes('barber') || cat.includes('nail') ||
      cat.includes('hair') || cat.includes('cosmetic') || sub.includes('beauty') || sub.includes('salon')) {
    return 'beauty';
  }
  if (cat.includes('gym') || cat.includes('fitness') || cat.includes('yoga') || cat.includes('sport') ||
      sub.includes('gym') || sub.includes('fitness')) {
    return 'fitness';
  }
  if (cat.includes('car') || cat.includes('auto') || cat.includes('mechanic') || cat.includes('tire') ||
      cat.includes('vehicle') || sub.includes('auto') || sub.includes('car')) {
    return 'automotive';
  }
  if (cat.includes('store') || cat.includes('shop') || cat.includes('retail') || cat.includes('boutique') ||
      cat.includes('market') || cat.includes('grocery') || sub.includes('store') || sub.includes('shop')) {
    return 'shopping';
  }
  if (cat.includes('lawyer') || cat.includes('attorney') || cat.includes('accountant') || cat.includes('insurance') ||
      cat.includes('consultant') || cat.includes('agency') || cat.includes('service') ||
      sub.includes('service') || sub.includes('professional')) {
    return 'services';
  }
  if (cat.includes('school') || cat.includes('education') || cat.includes('tutor') || cat.includes('academy') ||
      sub.includes('school') || sub.includes('education')) {
    return 'education';
  }
  if (cat.includes('pet') || cat.includes('vet') || cat.includes('animal') || cat.includes('grooming') ||
      sub.includes('pet') || sub.includes('veterinar')) {
    return 'pets';
  }
  if (cat.includes('bank') || cat.includes('credit') || cat.includes('financial') || cat.includes('loan') ||
      sub.includes('bank') || sub.includes('financial')) {
    return 'financial';
  }
  if (cat.includes('plumb') || cat.includes('electric') || cat.includes('hvac') || cat.includes('roofing') ||
      cat.includes('landscap') || cat.includes('clean') || cat.includes('contractor') || cat.includes('home') ||
      sub.includes('home') || sub.includes('contractor')) {
    return 'home';
  }
  if (cat.includes('entertainment') || cat.includes('theater') || cat.includes('cinema') || cat.includes('arcade') ||
      cat.includes('bowling') || sub.includes('entertainment')) {
    return 'entertainment';
  }

  // Default to services
  return 'services';
}

// Create a URL-friendly slug
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

// Parse hours from OutScraper format
function parseHours(hoursStr) {
  // Default empty hours
  const defaultHours = {
    monday: { isOpen: false },
    tuesday: { isOpen: false },
    wednesday: { isOpen: false },
    thursday: { isOpen: false },
    friday: { isOpen: false },
    saturday: { isOpen: false },
    sunday: { isOpen: false }
  };

  if (!hoursStr) return defaultHours;

  // OutScraper hours come in various formats, return default for now
  // We can enhance this later
  return defaultHours;
}

async function importBusinesses() {
  console.log('Starting import...');

  // Get location ID
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

  // Read both Excel files
  const files = [
    'C:/Users/TJ/OneDrive/Desktop/AI Apps/Local Directory/Outscraper-20250922192337xs82_restaurant_+13.xlsx',
    'C:/Users/TJ/OneDrive/Desktop/AI Apps/Local Directory/Outscraper-20250922194641b6f (1).xlsx'
  ];

  let allBusinesses = [];
  const seenSlugs = new Set();

  for (const filePath of files) {
    console.log(`Reading ${filePath}...`);
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log(`Found ${data.length} rows in file`);

    for (const row of data) {
      // Skip if no name or closed businesses
      if (!row.name || row.business_status === 'CLOSED_PERMANENTLY') continue;

      // Filter for relevant cities only
      const city = row.city || '';
      const validCities = ['leander', 'cedar park', 'liberty hill', 'austin', 'round rock', 'georgetown', 'pflugerville'];
      if (!validCities.some(c => city.toLowerCase().includes(c))) continue;

      // Create slug and check for duplicates
      let slug = createSlug(row.name);
      if (seenSlugs.has(slug)) {
        slug = slug + '-' + Math.random().toString(36).substring(2, 6);
      }
      seenSlugs.add(slug);

      const business = {
        location_id: locationId,
        slug: slug,
        name: row.name.substring(0, 255),
        description: row.description || row.about || `${row.name} located in ${row.city || 'the area'}.`,
        category: mapCategory(row.category, row.subtypes),
        subcategory: row.category ? row.category.substring(0, 100) : null,
        image: row.photo || '/placeholder.svg?height=400&width=600',
        photos: row.photo ? [row.photo] : [],
        phone: row.phone ? String(row.phone).substring(0, 20) : null,
        email: null,
        website: row.site || null,
        address_street: row.street || row.full_address?.split(',')[0] || 'Address not available',
        address_city: row.city || 'Leander',
        address_state: row.us_state?.substring(0, 2) || 'TX',
        address_zip: row.postal_code ? String(row.postal_code).substring(0, 10) : '78641',
        latitude: row.latitude || null,
        longitude: row.longitude || null,
        hours: parseHours(row.working_hours),
        rating: row.rating ? Math.min(5, Math.max(0, parseFloat(row.rating))) : 0,
        review_count: row.reviews ? parseInt(row.reviews) : 0,
        price_range: row.range || null,
        specialties: row.subtypes ? row.subtypes.split(',').map(s => s.trim()).slice(0, 10) : [],
        tags: row.subtypes ? row.subtypes.split(',').map(s => s.trim().toLowerCase()).slice(0, 10) : [],
        listing_tier: 'free',
        is_featured: false,
        backlink_enabled: false
      };

      // Ensure description is not empty
      if (!business.description || business.description.length < 10) {
        business.description = `${business.name} is a local business in ${business.address_city}, TX.`;
      }

      allBusinesses.push(business);
    }
  }

  console.log(`Total businesses to import: ${allBusinesses.length}`);

  // Import in batches of 100
  const batchSize = 100;
  let imported = 0;
  let errors = 0;

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
    if ((i + batchSize) % 500 === 0 || i + batchSize >= allBusinesses.length) {
      console.log(`Progress: ${Math.min(i + batchSize, allBusinesses.length)}/${allBusinesses.length} (${imported} imported, ${errors} errors)`);
    }
  }

  console.log(`\nImport complete!`);
  console.log(`Successfully imported: ${imported}`);
  console.log(`Errors: ${errors}`);
}

importBusinesses().catch(console.error);
