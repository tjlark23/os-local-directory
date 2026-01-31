"""
HUTTO TEST SCRAPE - PHASE 1
Scrape 20 businesses from Hutto, TX with photos and reviews
"""

from outscraper import ApiClient
import json
import time
import os

# API key from previous session
api = ApiClient(api_key='OWEyMjRmNTZlYzY3NDU3N2IzYWRkMGU4MjUwNmRiYjV8ZjQ3Y2Y3MjM1YQ')

# 10 queries, 2 businesses each = 20 total
QUERIES = [
    "restaurants in Hutto, TX",
    "coffee shops in Hutto, TX",
    "hair salons in Hutto, TX",
    "gyms in Hutto, TX",
    "dentists in Hutto, TX",
    "auto repair in Hutto, TX",
    "pet stores in Hutto, TX",
    "plumbers in Hutto, TX",
    "banks in Hutto, TX",
    "grocery stores in Hutto, TX"
]

all_results = []

print("="*60)
print("SCRAPING 20 HUTTO BUSINESSES")
print("="*60)
print("\nUsing google_maps_reviews endpoint (returns business + reviews + photos)")

for query in QUERIES:
    print(f"\nQuery: {query}")

    try:
        # Use google_maps_reviews endpoint - this returns reviews AND photos
        # Unlike google_maps_search which only returns basic info
        results = api.google_maps_reviews(
            query=query,
            limit=2,  # 2 businesses per query = 20 total
            reviews_limit=10,  # 10 reviews per business
            language='en',
            region='us'
        )

        # Results come as list of lists
        if results and len(results) > 0:
            for result in results:
                if isinstance(result, list):
                    all_results.extend(result)
                else:
                    all_results.append(result)

        print(f"  Returned: {len(results) if results else 0} results")

        time.sleep(1)  # Rate limiting

    except Exception as e:
        print(f"  ERROR: {str(e)}")

print(f"\n{'='*60}")
print(f"SCRAPE COMPLETE: {len(all_results)} total rows")
print(f"{'='*60}")

# Check data structure
if all_results and len(all_results) > 0:
    print("\nSample data structure (first result):")
    first = all_results[0]
    print(f"  Name: {first.get('name')}")
    print(f"  City: {first.get('city')}")
    print(f"  Rating: {first.get('rating')}")
    print(f"  Photo: {first.get('photo', 'N/A')[:50] if first.get('photo') else 'None'}...")

    # Check for reviews data
    review_keys = [k for k in first.keys() if 'review' in k.lower()]
    print(f"  Review-related keys: {len(review_keys)}")

    # Check place_id counts to detect format
    place_ids = [r.get('place_id') for r in all_results if r.get('place_id')]
    unique_place_ids = set(place_ids)
    print(f"\n  Total rows: {len(all_results)}")
    print(f"  Unique place_ids: {len(unique_place_ids)}")

    if len(all_results) > len(unique_place_ids):
        print("  Format: DENORMALIZED (multiple rows per business)")
    else:
        print("  Format: NORMALIZED (one row per business)")

# Save raw data
output_file = os.path.join(os.path.dirname(__file__), 'hutto_test_raw.json')
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(all_results, f, indent=2, ensure_ascii=False)

print(f"\nSaved to: {output_file}")
