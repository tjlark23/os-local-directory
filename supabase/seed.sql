-- Seed data for Leander Scoop directory
-- Run this AFTER schema.sql

-- Insert Leander Scoop location
INSERT INTO locations (slug, name, domain, logo_url, primary_color, tagline, cities, state)
VALUES (
  'leander',
  'Leander Scoop',
  'directory.leanderscoop.com',
  NULL,
  '#2563eb',
  'Your Local Guide to Leander, Cedar Park & Liberty Hill',
  ARRAY['Leander', 'Cedar Park', 'Liberty Hill'],
  'TX'
);

-- Get the location ID for inserting businesses
DO $$
DECLARE
  leander_id UUID;
BEGIN
  SELECT id INTO leander_id FROM locations WHERE slug = 'leander';

  -- Insert sample businesses
  INSERT INTO businesses (
    location_id, slug, name, description, category, image, phone, website,
    address_street, address_city, address_state, address_zip,
    hours, rating, review_count, price_range, year_established, owner,
    specialties, amenities, tags, listing_tier
  ) VALUES
  (
    leander_id,
    'bluebonnet-bbq',
    'Bluebonnet BBQ',
    'Award-winning Texas BBQ featuring slow-smoked brisket, ribs, and sausage. Family-owned and operated since 2015, serving authentic Hill Country flavors.',
    'restaurants',
    '/placeholder.svg?height=400&width=600',
    '(512) 555-0101',
    'https://bluebonnetbbq.com',
    '100 N US Highway 183',
    'Leander',
    'TX',
    '78641',
    '{"monday": {"isOpen": true, "open": "11:00", "close": "21:00"}, "tuesday": {"isOpen": true, "open": "11:00", "close": "21:00"}, "wednesday": {"isOpen": true, "open": "11:00", "close": "21:00"}, "thursday": {"isOpen": true, "open": "11:00", "close": "21:00"}, "friday": {"isOpen": true, "open": "11:00", "close": "22:00"}, "saturday": {"isOpen": true, "open": "11:00", "close": "22:00"}, "sunday": {"isOpen": true, "open": "11:00", "close": "20:00"}}',
    4.8,
    342,
    '$$',
    2015,
    'Mike Johnson',
    ARRAY['Brisket', 'Ribs', 'Sausage', 'Pulled Pork', 'Catering'],
    ARRAY['{"name": "Outdoor Seating", "icon": "sun"}'::jsonb, '{"name": "Family Friendly", "icon": "users"}'::jsonb, '{"name": "Catering", "icon": "truck"}'::jsonb],
    ARRAY['bbq', 'texas bbq', 'brisket', 'family restaurant', 'local favorite'],
    'featured'
  ),
  (
    leander_id,
    'cedar-park-dental',
    'Cedar Park Family Dental',
    'Comprehensive dental care for the whole family. Our modern facility offers general dentistry, cosmetic procedures, and emergency services.',
    'health',
    '/placeholder.svg?height=400&width=600',
    '(512) 555-0202',
    'https://cedarparkfamilydental.com',
    '200 E Whitestone Blvd',
    'Cedar Park',
    'TX',
    '78613',
    '{"monday": {"isOpen": true, "open": "08:00", "close": "17:00"}, "tuesday": {"isOpen": true, "open": "08:00", "close": "17:00"}, "wednesday": {"isOpen": true, "open": "08:00", "close": "17:00"}, "thursday": {"isOpen": true, "open": "08:00", "close": "17:00"}, "friday": {"isOpen": true, "open": "08:00", "close": "14:00"}, "saturday": {"isOpen": false}, "sunday": {"isOpen": false}}',
    4.9,
    287,
    '$$',
    2008,
    'Dr. Sarah Chen',
    ARRAY['General Dentistry', 'Cosmetic Dentistry', 'Invisalign', 'Emergency Care', 'Pediatric Dentistry'],
    ARRAY['{"name": "Accepts Insurance", "icon": "shield"}'::jsonb, '{"name": "Free Parking", "icon": "car"}'::jsonb, '{"name": "Wheelchair Accessible", "icon": "accessibility"}'::jsonb],
    ARRAY['dentist', 'family dentist', 'cosmetic dentistry', 'invisalign'],
    'premium'
  ),
  (
    leander_id,
    'liberty-hill-hardware',
    'Liberty Hill Hardware & Supply',
    'Your neighborhood hardware store with everything you need for home improvement. Expert advice and friendly service since 1992.',
    'shopping',
    '/placeholder.svg?height=400&width=600',
    '(512) 555-0303',
    'https://libertyhillhardware.com',
    '14000 W State Highway 29',
    'Liberty Hill',
    'TX',
    '78642',
    '{"monday": {"isOpen": true, "open": "07:00", "close": "19:00"}, "tuesday": {"isOpen": true, "open": "07:00", "close": "19:00"}, "wednesday": {"isOpen": true, "open": "07:00", "close": "19:00"}, "thursday": {"isOpen": true, "open": "07:00", "close": "19:00"}, "friday": {"isOpen": true, "open": "07:00", "close": "19:00"}, "saturday": {"isOpen": true, "open": "08:00", "close": "17:00"}, "sunday": {"isOpen": true, "open": "10:00", "close": "15:00"}}',
    4.7,
    156,
    '$',
    1992,
    'Tom Williams',
    ARRAY['Tools', 'Lumber', 'Plumbing', 'Electrical', 'Paint', 'Garden Supplies'],
    ARRAY['{"name": "Free Parking", "icon": "car"}'::jsonb, '{"name": "Delivery Available", "icon": "truck"}'::jsonb, '{"name": "Expert Staff", "icon": "user-check"}'::jsonb],
    ARRAY['hardware', 'home improvement', 'tools', 'lumber', 'local business'],
    'free'
  ),
  (
    leander_id,
    'hill-country-fitness',
    'Hill Country Fitness',
    'State-of-the-art fitness facility featuring cardio equipment, free weights, group classes, and personal training. Your goals are our mission.',
    'health',
    '/placeholder.svg?height=400&width=600',
    '(512) 555-0404',
    'https://hillcountryfitness.com',
    '1805 S US Highway 183',
    'Leander',
    'TX',
    '78641',
    '{"monday": {"isOpen": true, "open": "05:00", "close": "22:00"}, "tuesday": {"isOpen": true, "open": "05:00", "close": "22:00"}, "wednesday": {"isOpen": true, "open": "05:00", "close": "22:00"}, "thursday": {"isOpen": true, "open": "05:00", "close": "22:00"}, "friday": {"isOpen": true, "open": "05:00", "close": "21:00"}, "saturday": {"isOpen": true, "open": "07:00", "close": "19:00"}, "sunday": {"isOpen": true, "open": "08:00", "close": "18:00"}}',
    4.6,
    423,
    '$$',
    2018,
    'Jake Martinez',
    ARRAY['Personal Training', 'Group Classes', 'Yoga', 'Spinning', 'CrossFit', 'Nutrition Coaching'],
    ARRAY['{"name": "Locker Rooms", "icon": "lock"}'::jsonb, '{"name": "Free Parking", "icon": "car"}'::jsonb, '{"name": "Childcare", "icon": "baby"}'::jsonb, '{"name": "24/7 Access", "icon": "clock"}'::jsonb],
    ARRAY['gym', 'fitness', 'personal training', 'yoga', 'crossfit'],
    'premium'
  ),
  (
    leander_id,
    'texas-star-realty',
    'Texas Star Realty',
    'Full-service real estate agency specializing in residential properties throughout Leander, Cedar Park, and Liberty Hill. Let us find your dream home.',
    'services',
    '/placeholder.svg?height=400&width=600',
    '(512) 555-0505',
    'https://texasstarrealty.com',
    '500 N Bell Blvd',
    'Cedar Park',
    'TX',
    '78613',
    '{"monday": {"isOpen": true, "open": "09:00", "close": "18:00"}, "tuesday": {"isOpen": true, "open": "09:00", "close": "18:00"}, "wednesday": {"isOpen": true, "open": "09:00", "close": "18:00"}, "thursday": {"isOpen": true, "open": "09:00", "close": "18:00"}, "friday": {"isOpen": true, "open": "09:00", "close": "18:00"}, "saturday": {"isOpen": true, "open": "10:00", "close": "16:00"}, "sunday": {"isOpen": false}}',
    4.9,
    189,
    NULL,
    2010,
    'Lisa Thompson',
    ARRAY['Buyer Representation', 'Seller Representation', 'New Construction', 'Relocation Services', 'Investment Properties'],
    ARRAY['{"name": "Free Consultations", "icon": "message-circle"}'::jsonb, '{"name": "Virtual Tours", "icon": "video"}'::jsonb],
    ARRAY['real estate', 'homes for sale', 'realtor', 'property', 'buy home'],
    'featured'
  );

END $$;
