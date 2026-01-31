"""
Phase 3: Import Round Rock test businesses to database
Filters out businesses not in Round Rock
Imports businesses + reviews
"""

import json
import sys
import os

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

# Add parent directory for imports
sys.path.insert(0, 'C:/Users/tjlar/Desktop/os-local-directory')

from supabase import create_client

# Supabase credentials
SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'

print("=" * 60)
print("PHASE 3: IMPORTING TO DATABASE")
print("=" * 60)

# Load scraped data
input_path = 'C:/Users/tjlar/Desktop/os-local-directory/scripts/roundrock_unique.json'
with open(input_path, 'r', encoding='utf-8') as f:
    all_businesses = json.load(f)

print(f"\nLoaded {len(all_businesses)} businesses from file")

# Filter to Round Rock only
round_rock_businesses = [
    biz for biz in all_businesses
    if 'round rock' in (biz.get('city', '') or '').lower()
]

print(f"After filtering to Round Rock: {len(round_rock_businesses)} businesses")

# Connect to Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

imported_businesses = 0
imported_reviews = 0
skipped_duplicates = 0
errors = []

print(f"\n{'─'*60}")
print("IMPORTING BUSINESSES AND REVIEWS")
print(f"{'─'*60}")

for i, biz in enumerate(round_rock_businesses, 1):
    place_id = biz.get('place_id')
    name = biz.get('name', 'Unknown')

    print(f"\n[{i}/{len(round_rock_businesses)}] {name}")

    # Check if already exists
    existing = supabase.table('businesses').select('id').eq('place_id', place_id).execute()
    if existing.data:
        print(f"  [SKIP] Already exists in database")
        skipped_duplicates += 1
        continue

    try:
        # Prepare business data
        business_data = {
            'name': name,
            'address': biz.get('full_address') or biz.get('address'),
            'city': 'Round Rock',
            'state': 'TX',
            'zip': biz.get('postal_code'),
            'phone': biz.get('phone'),
            'website': biz.get('website') or biz.get('site'),
            'rating': biz.get('rating', 0),
            'review_count': biz.get('reviews', 0),
            'category': biz.get('our_category', 'Other'),
            'latitude': biz.get('latitude'),
            'longitude': biz.get('longitude'),
            'place_id': place_id,
            'tier': 'free',
            'featured': False,
            'image_url': biz.get('photo'),
            'description': biz.get('description'),
        }

        # Store hours as JSON string if present
        if biz.get('working_hours'):
            business_data['hours'] = json.dumps(biz.get('working_hours'))

        # Insert business
        result = supabase.table('businesses').insert(business_data).execute()

        if result.data:
            business_id = result.data[0]['id']
            imported_businesses += 1
            print(f"  [OK] Imported business (ID: {business_id[:8]}...)")

            # Import reviews for this business
            reviews_data = biz.get('reviews_data', [])
            reviews_imported_for_biz = 0

            for review in reviews_data:
                review_text = review.get('review_text')
                if not review_text:
                    continue

                review_id = review.get('review_id')
                if not review_id:
                    # Generate a unique ID if not provided
                    review_id = f"{place_id}_{review.get('author_id', 'unknown')}_{review.get('review_timestamp', 0)}"

                review_data = {
                    'business_id': business_id,
                    'author_name': review.get('author_title'),
                    'author_id': review.get('author_id'),
                    'author_image': review.get('author_image'),
                    'rating': int(review.get('review_rating', 5)),
                    'text': review_text,
                    'review_id': review_id,
                    'review_link': review.get('review_link'),
                    'likes': review.get('review_likes', 0),
                    'source': 'google'
                }

                # Parse review date if available
                if review.get('review_datetime_utc'):
                    review_data['review_date'] = review.get('review_datetime_utc')

                if review.get('review_timestamp'):
                    review_data['review_timestamp'] = review.get('review_timestamp')

                try:
                    supabase.table('reviews').insert(review_data).execute()
                    imported_reviews += 1
                    reviews_imported_for_biz += 1
                except Exception as e:
                    if 'duplicate' not in str(e).lower():
                        print(f"    [!] Review error: {str(e)[:60]}")

            print(f"  [OK] Imported {reviews_imported_for_biz} reviews")

    except Exception as e:
        error_msg = f"{name}: {str(e)}"
        errors.append(error_msg)
        print(f"  [ERROR] {str(e)[:80]}")

# ========================================
# IMPORT SUMMARY
# ========================================
print(f"\n{'='*60}")
print("IMPORT COMPLETE - SUMMARY")
print(f"{'='*60}")
print(f"\nBusinesses:")
print(f"  Imported: {imported_businesses}")
print(f"  Skipped (duplicates): {skipped_duplicates}")
print(f"  Errors: {len(errors)}")

print(f"\nReviews:")
print(f"  Imported: {imported_reviews}")

if errors:
    print(f"\nErrors ({len(errors)}):")
    for error in errors[:10]:
        print(f"  - {error}")

# ========================================
# VERIFY IN DATABASE
# ========================================
print(f"\n{'='*60}")
print("DATABASE VERIFICATION")
print(f"{'='*60}")

# Count Round Rock businesses
result = supabase.table('businesses').select('*', count='exact').eq('city', 'Round Rock').execute()
db_count = result.count
print(f"\nRound Rock businesses in database: {db_count}")

# Count reviews for Round Rock businesses
rr_businesses = supabase.table('businesses').select('id').eq('city', 'Round Rock').execute()
if rr_businesses.data:
    business_ids = [b['id'] for b in rr_businesses.data]
    reviews_result = supabase.table('reviews').select('*', count='exact').in_('business_id', business_ids).execute()
    reviews_count = reviews_result.count
    print(f"Reviews for Round Rock businesses: {reviews_count}")

# Sample businesses
print(f"\nSample imported businesses:")
sample = supabase.table('businesses').select('name, category, rating, review_count').eq('city', 'Round Rock').limit(5).execute()
for biz in sample.data:
    print(f"  - {biz['name']} ({biz['category']}) - {biz['rating']} stars, {biz['review_count']} reviews")

print(f"\n{'='*60}")
print("[DONE] Phase 3 complete!")
print("       Check live site: https://wilcoguide.com/directory/round-rock")
print(f"{'='*60}")
