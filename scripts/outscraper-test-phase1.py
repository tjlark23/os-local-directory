"""
Phase 1: Test Outscraper API with single query
Target: Mexican restaurants in Round Rock, TX (limit 2)
Uses google_maps_reviews endpoint which returns business info + reviews
"""

from outscraper import ApiClient
import json
import sys

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

API_KEY = 'OWEyMjRmNTZlYzY3NDU3N2IzYWRkMGU4MjUwNmRiYjV8ZjQ3Y2Y3MjM1YQ'

print("=" * 60)
print("PHASE 1: OUTSCRAPER API TEST")
print("=" * 60)
print()
print("Using: google_maps_reviews endpoint")
print("Query: Mexican restaurants in Round Rock, TX")
print("Limit: 2 businesses")
print("Reviews limit: 10 per business")
print()

api = ApiClient(api_key=API_KEY)

try:
    # google_maps_reviews returns business info + reviews
    results = api.google_maps_reviews(
        query="Mexican restaurants in Round Rock, TX",
        limit=2,              # Number of businesses
        reviews_limit=10,     # Reviews per business
        language='en',
        region='us'
    )

    # Results come as list of lists, flatten if needed
    if results and isinstance(results[0], list):
        results = results[0]

    print(f"Results returned: {len(results)}")
    print()

    print("-" * 60)
    print("RESULTS:")
    print("-" * 60)

    all_checks_passed = True

    for i, biz in enumerate(results):
        name = biz.get('name', 'MISSING')
        city = biz.get('city', 'MISSING')
        rating = biz.get('rating', 0)
        reviews_count = biz.get('reviews', 0)
        phone = biz.get('phone', 'N/A')
        website = biz.get('site') or biz.get('website', 'N/A')
        place_id = biz.get('place_id', 'MISSING')
        address = biz.get('full_address') or biz.get('address', 'N/A')

        # Get photos and reviews data
        photo = biz.get('photo')  # Main photo URL
        photos_data = biz.get('photos', [])  # Array of photo URLs if available
        reviews_data = biz.get('reviews_data', [])
        hours = biz.get('working_hours')

        print(f"\nBusiness #{i+1}: {name}")
        print(f"  City: {city}")
        print(f"  Address: {address}")
        print(f"  Rating: {rating} stars ({reviews_count} total reviews)")
        print(f"  Phone: {phone}")
        print(f"  Website: {website[:50] + '...' if website and len(website) > 50 else website}")
        print(f"  Place ID: {place_id}")
        print(f"  Main photo: {'Yes' if photo else 'No'}")
        print(f"  Reviews returned: {len(reviews_data)} (expected: up to 10)")
        print(f"  Hours: {'Yes' if hours else 'MISSING'}")

        # Show main photo URL
        if photo:
            print(f"  Photo URL: {photo[:80]}...")
        else:
            print(f"  [!] NO MAIN PHOTO")

        # Show sample reviews
        if reviews_data:
            sample_review = reviews_data[0]
            review_text = sample_review.get('review_text', '')
            if review_text:
                review_text = review_text[:80]
            else:
                review_text = 'N/A'
            author = sample_review.get('author_title', 'Unknown')
            review_rating = sample_review.get('review_rating', 'N/A')
            print(f"  Sample review by {author} ({review_rating} stars): \"{review_text}...\"")
        else:
            print(f"  [!] NO REVIEWS DATA RETURNED")
            all_checks_passed = False

        # Check city
        if 'round rock' not in (city or '').lower():
            print(f"  [!] WARNING: City is '{city}', not 'Round Rock'")

    # Verification summary
    print()
    print("-" * 60)
    print("VERIFICATION SUMMARY:")
    print("-" * 60)

    check_results = []

    # Check 1: Results returned
    check1 = len(results) >= 2
    check_results.append(("Results returned (>=2)", check1, len(results)))

    # Check 2: All from Round Rock
    all_round_rock = all(
        'round rock' in (biz.get('city', '') or '').lower()
        for biz in results
    )
    check_results.append(("All from Round Rock", all_round_rock, None))

    # Check 3: All have main photo
    all_have_photo = all(biz.get('photo') for biz in results)
    check_results.append(("All have main photo", all_have_photo, None))

    # Check 4: All have reviews_data
    all_have_reviews = all(len(biz.get('reviews_data', [])) > 0 for biz in results)
    avg_reviews = sum(len(biz.get('reviews_data', [])) for biz in results) / len(results) if results else 0
    check_results.append(("All have reviews_data", all_have_reviews, f"avg {avg_reviews:.1f}"))

    # Check 5: All have hours
    all_have_hours = all(biz.get('working_hours') for biz in results)
    check_results.append(("All have working_hours", all_have_hours, None))

    # Check 6: All have rating
    all_have_rating = all(biz.get('rating', 0) > 0 for biz in results)
    check_results.append(("All have rating > 0", all_have_rating, None))

    # Check 7: All have address
    all_have_address = all(biz.get('full_address') or biz.get('address') for biz in results)
    check_results.append(("All have address", all_have_address, None))

    for check_name, passed, extra in check_results:
        status = "[PASS]" if passed else "[FAIL]"
        extra_str = f" ({extra})" if extra else ""
        print(f"  {status} {check_name}{extra_str}")
        if not passed:
            all_checks_passed = False

    print()
    print("=" * 60)
    if all_checks_passed:
        print("[PASS] PHASE 1 PASSED - API working correctly!")
        print("       google_maps_reviews returns business info + reviews")
        print("       Ready to proceed to Phase 2")
    else:
        print("[FAIL] PHASE 1 HAS ISSUES - Review warnings above")
        print("       Some checks failed but may be acceptable")
    print("=" * 60)

    # Save raw results for debugging
    output_path = 'C:/Users/tjlar/Desktop/os-local-directory/scripts/phase1_results.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print()
    print(f"Raw results saved to: {output_path}")

    # Show all available fields for first business
    print()
    print("-" * 60)
    print("ALL FIELDS AVAILABLE (first business):")
    print("-" * 60)
    if results:
        for key in sorted(results[0].keys()):
            value = results[0][key]
            if isinstance(value, list):
                print(f"  {key}: [list with {len(value)} items]")
            elif isinstance(value, dict):
                print(f"  {key}: [dict with {len(value)} keys]")
            elif isinstance(value, str) and len(value) > 60:
                print(f"  {key}: {value[:60]}...")
            else:
                print(f"  {key}: {value}")

except Exception as e:
    print(f"[ERROR] API call failed: {e}")
    import traceback
    traceback.print_exc()
    print()
    print("=" * 60)
    print("[FAIL] PHASE 1 FAILED - Cannot proceed")
    print("=" * 60)
