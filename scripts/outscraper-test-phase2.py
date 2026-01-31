"""
Phase 2: Run all 20 category queries for Round Rock
Uses google_maps_reviews endpoint which returns business info + reviews
"""

from outscraper import ApiClient
import json
import sys
import time

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

API_KEY = 'OWEyMjRmNTZlYzY3NDU3N2IzYWRkMGU4MjUwNmRiYjV8ZjQ3Y2Y3MjM1YQ'

print("=" * 60)
print("PHASE 2: SCRAPING 20 TEST BUSINESSES")
print("=" * 60)
print()

# Define queries - 2 per category
QUERIES = [
    # Restaurants
    ("Mexican restaurants in Round Rock, TX", 2, "Restaurants"),
    ("Italian restaurants in Round Rock, TX", 2, "Restaurants"),

    # Health
    ("Doctors in Round Rock, TX", 2, "Health"),
    ("Dentists in Round Rock, TX", 2, "Health"),

    # Beauty
    ("Hair salons in Round Rock, TX", 2, "Beauty"),
    ("Nail salons in Round Rock, TX", 2, "Beauty"),

    # Fitness
    ("Gyms in Round Rock, TX", 2, "Fitness"),
    ("Yoga studios in Round Rock, TX", 2, "Fitness"),

    # Automotive
    ("Auto repair in Round Rock, TX", 2, "Automotive"),
    ("Car wash in Round Rock, TX", 2, "Car Wash"),

    # Services
    ("Plumbers in Round Rock, TX", 2, "Services"),
    ("Electricians in Round Rock, TX", 2, "Services"),

    # Education
    ("Preschools in Round Rock, TX", 2, "Education"),
    ("Tutoring centers in Round Rock, TX", 2, "Education"),

    # Pets
    ("Veterinarians in Round Rock, TX", 2, "Pets"),
    ("Pet stores in Round Rock, TX", 2, "Pets"),

    # Financial
    ("Banks in Round Rock, TX", 2, "Financial"),
    ("Insurance agencies in Round Rock, TX", 2, "Financial"),

    # Home
    ("Furniture stores in Round Rock, TX", 2, "Home"),
    ("Home improvement in Round Rock, TX", 2, "Home"),
]

api = ApiClient(api_key=API_KEY)
all_businesses = []
query_stats = []

for i, (query, limit, category) in enumerate(QUERIES, 1):
    print(f"\n[{i}/{len(QUERIES)}] Querying: {query}")

    try:
        results = api.google_maps_reviews(
            query=query,
            limit=limit,
            reviews_limit=10,
            language='en',
            region='us'
        )

        # Flatten if nested
        if results and isinstance(results[0], list):
            results = results[0]

        print(f"  Found: {len(results)} businesses")

        # Verify each business
        for biz in results:
            # Tag with our category
            biz['our_category'] = category

            name = biz.get('name', 'Unknown')
            city = biz.get('city', 'Unknown')
            reviews_count = len(biz.get('reviews_data', []))
            has_photo = 'Yes' if biz.get('photo') else 'No'
            has_hours = 'Yes' if biz.get('working_hours') else 'No'

            print(f"    - {name} | {city} | {reviews_count} reviews | photo:{has_photo} | hours:{has_hours}")

            if 'round rock' not in city.lower():
                print(f"      [!] WARNING: Not in Round Rock (city={city})")

        all_businesses.extend(results)

        query_stats.append({
            'query': query,
            'category': category,
            'expected': limit,
            'actual': len(results),
            'avg_reviews': sum(len(b.get('reviews_data', [])) for b in results) / len(results) if results else 0
        })

        time.sleep(1)  # Rate limiting

    except Exception as e:
        print(f"  [ERROR] {str(e)}")
        query_stats.append({
            'query': query,
            'category': category,
            'expected': limit,
            'actual': 0,
            'error': str(e)
        })

# Save all results
output_path = 'C:/Users/tjlar/Desktop/os-local-directory/scripts/roundrock_test_20.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(all_businesses, f, indent=2, ensure_ascii=False)

print(f"\n{'='*60}")
print("SCRAPING COMPLETE")
print(f"{'='*60}")
print(f"Total businesses scraped: {len(all_businesses)}")
print(f"Saved to: {output_path}")

# ========================================
# DATA QUALITY ANALYSIS
# ========================================
print(f"\n{'='*60}")
print("DATA QUALITY ANALYSIS")
print(f"{'='*60}")

# Deduplicate by place_id
unique_businesses = {}
for biz in all_businesses:
    place_id = biz.get('place_id')
    if place_id and place_id not in unique_businesses:
        unique_businesses[place_id] = biz

unique_count = len(unique_businesses)
total_count = len(all_businesses)

print(f"\nCounts:")
print(f"  Total scraped: {total_count}")
print(f"  Unique (by place_id): {unique_count}")
print(f"  Duplicates: {total_count - unique_count}")

# City distribution
cities = {}
for biz in all_businesses:
    city = biz.get('city', 'Unknown')
    cities[city] = cities.get(city, 0) + 1

print(f"\nBusinesses by city:")
for city, count in sorted(cities.items(), key=lambda x: x[1], reverse=True):
    pct = (count / total_count * 100) if total_count > 0 else 0
    print(f"  {city}: {count} ({pct:.1f}%)")

# Round Rock percentage
round_rock_count = sum(1 for biz in all_businesses if 'round rock' in (biz.get('city', '') or '').lower())
rr_pct = (round_rock_count / total_count * 100) if total_count > 0 else 0

# Data completeness
has_photo = sum(1 for biz in all_businesses if biz.get('photo'))
has_reviews = sum(1 for biz in all_businesses if len(biz.get('reviews_data', [])) > 0)
has_hours = sum(1 for biz in all_businesses if biz.get('working_hours'))
has_phone = sum(1 for biz in all_businesses if biz.get('phone'))
has_website = sum(1 for biz in all_businesses if biz.get('website'))
has_address = sum(1 for biz in all_businesses if biz.get('full_address') or biz.get('address'))

print(f"\nData completeness:")
print(f"  Have photo: {has_photo}/{total_count} ({has_photo/total_count*100:.1f}%)")
print(f"  Have reviews: {has_reviews}/{total_count} ({has_reviews/total_count*100:.1f}%)")
print(f"  Have hours: {has_hours}/{total_count} ({has_hours/total_count*100:.1f}%)")
print(f"  Have phone: {has_phone}/{total_count} ({has_phone/total_count*100:.1f}%)")
print(f"  Have website: {has_website}/{total_count} ({has_website/total_count*100:.1f}%)")
print(f"  Have address: {has_address}/{total_count} ({has_address/total_count*100:.1f}%)")

# Review averages
avg_reviews = sum(len(biz.get('reviews_data', [])) for biz in all_businesses) / total_count if total_count > 0 else 0

print(f"\nAverages per business:")
print(f"  Reviews: {avg_reviews:.1f} (expected: 8-10)")

# Category distribution
categories = {}
for biz in all_businesses:
    cat = biz.get('our_category', 'Unknown')
    categories[cat] = categories.get(cat, 0) + 1

print(f"\nBy category:")
for cat, count in sorted(categories.items()):
    print(f"  {cat}: {count}")

# ========================================
# VERIFICATION SUMMARY
# ========================================
print(f"\n{'='*60}")
print("VERIFICATION SUMMARY")
print(f"{'='*60}")

checks = []

# Check 1: Enough businesses
checks.append(("Unique businesses >= 30", unique_count >= 30, f"{unique_count}"))

# Check 2: Round Rock percentage
checks.append(("Round Rock >= 80%", rr_pct >= 80, f"{rr_pct:.1f}%"))

# Check 3: Photo percentage
photo_pct = has_photo/total_count*100 if total_count > 0 else 0
checks.append(("Have photo >= 80%", photo_pct >= 80, f"{photo_pct:.1f}%"))

# Check 4: Reviews percentage
reviews_pct = has_reviews/total_count*100 if total_count > 0 else 0
checks.append(("Have reviews >= 80%", reviews_pct >= 80, f"{reviews_pct:.1f}%"))

# Check 5: Hours percentage
hours_pct = has_hours/total_count*100 if total_count > 0 else 0
checks.append(("Have hours >= 70%", hours_pct >= 70, f"{hours_pct:.1f}%"))

# Check 6: Average reviews
checks.append(("Avg reviews >= 5", avg_reviews >= 5, f"{avg_reviews:.1f}"))

all_passed = True
for check_name, passed, value in checks:
    status = "[PASS]" if passed else "[FAIL]"
    print(f"  {status} {check_name}: {value}")
    if not passed:
        all_passed = False

print()
print("=" * 60)
if all_passed:
    print("[PASS] PHASE 2 PASSED - Data quality is good!")
    print("       Ready for TJ approval to proceed to Phase 3")
else:
    print("[WARNING] PHASE 2 HAS ISSUES - Review failures above")
    print("          Some checks failed - review before proceeding")
print("=" * 60)

# Save unique businesses for import
unique_output_path = 'C:/Users/tjlar/Desktop/os-local-directory/scripts/roundrock_unique.json'
with open(unique_output_path, 'w', encoding='utf-8') as f:
    json.dump(list(unique_businesses.values()), f, indent=2, ensure_ascii=False)
print(f"\nUnique businesses saved to: {unique_output_path}")
