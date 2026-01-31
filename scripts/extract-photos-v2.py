import pandas as pd
import glob
import json
import os

# Load all Excel files
files = glob.glob(r'C:\Users\tjlar\Downloads\Outscraper-*.xlsx')
all_data = []

print(f"Found {len(files)} Excel files")
for file in files:
    print(f"  Loading: {os.path.basename(file)}")
    df = pd.read_excel(file)
    all_data.append(df)

combined = pd.concat(all_data, ignore_index=True)

print(f"\nTotal rows in all files: {len(combined)}")

# Group by place_id and collect UNIQUE photos
business_photos = {}

for _, row in combined.iterrows():
    place_id = row.get('place_id')
    name = row.get('name')

    if not place_id or pd.isna(place_id):
        continue

    # Initialize if first time seeing this business
    if place_id not in business_photos:
        business_photos[place_id] = {
            'name': name,
            'place_id': place_id,
            'city': row.get('city', 'Unknown'),
            'main_photo': None,
            'street_view': None,
            'logo': None,
            'review_photos': set()
        }

    # Get main photo (only first one)
    if business_photos[place_id]['main_photo'] is None:
        photo = row.get('photo')
        if photo and pd.notna(photo):
            business_photos[place_id]['main_photo'] = photo

    # Get street view (only first one)
    if business_photos[place_id]['street_view'] is None:
        street_view = row.get('street_view')
        if street_view and pd.notna(street_view):
            business_photos[place_id]['street_view'] = street_view

    # Get logo (only first one)
    if business_photos[place_id]['logo'] is None:
        logo = row.get('logo')
        if logo and pd.notna(logo):
            business_photos[place_id]['logo'] = logo

    # Get review photos (unique set)
    review_img = row.get('google_maps_reviews.review_img_url')
    if review_img and pd.notna(review_img):
        business_photos[place_id]['review_photos'].add(review_img)

# Now build combined photos list for each business
for place_id, data in business_photos.items():
    all_photos = []

    # Add main photo first
    if data['main_photo']:
        all_photos.append(data['main_photo'])

    # Add review photos (different from main photo)
    for rp in data['review_photos']:
        if rp not in all_photos and len(all_photos) < 5:
            all_photos.append(rp)

    # If still not 5, add street view if different
    if len(all_photos) < 5 and data['street_view'] and data['street_view'] not in all_photos:
        all_photos.append(data['street_view'])

    # Convert set to list for JSON serialization
    data['review_photos'] = list(data['review_photos'])
    data['combined_photos'] = all_photos

# Stats
total_businesses = len(business_photos)
with_5_photos = sum(1 for b in business_photos.values() if len(b['combined_photos']) >= 5)
with_3_photos = sum(1 for b in business_photos.values() if 3 <= len(b['combined_photos']) < 5)
with_2_photos = sum(1 for b in business_photos.values() if len(b['combined_photos']) == 2)
with_1_photo = sum(1 for b in business_photos.values() if len(b['combined_photos']) == 1)
with_0_photos = sum(1 for b in business_photos.values() if len(b['combined_photos']) == 0)

print(f"\n{'='*60}")
print("EXTRACTION RESULTS (UNIQUE PHOTOS ONLY):")
print(f"{'='*60}")
print(f"Total businesses: {total_businesses}")
print(f"With 5 photos: {with_5_photos}")
print(f"With 3-4 photos: {with_3_photos}")
print(f"With 2 photos: {with_2_photos}")
print(f"With 1 photo: {with_1_photo}")
print(f"With 0 photos: {with_0_photos}")

# Show examples
print(f"\n{'='*60}")
print("SAMPLE (First 5 businesses):")
print(f"{'='*60}")

for place_id, data in list(business_photos.items())[:5]:
    print(f"\n{data['name']} ({data['city']}):")
    print(f"  Has main photo: {'Yes' if data['main_photo'] else 'No'}")
    print(f"  Has street view: {'Yes' if data['street_view'] else 'No'}")
    print(f"  Review photos: {len(data['review_photos'])}")
    print(f"  Combined unique photos: {len(data['combined_photos'])}")
    for i, photo in enumerate(data['combined_photos'], 1):
        # Show more of the URL to verify uniqueness
        print(f"    {i}. ...{photo[-50:]}")

# Save for database update
output_file = r'C:\Users\tjlar\Desktop\os-local-directory\scripts\extracted_photos.json'
with open(output_file, 'w') as f:
    json.dump(business_photos, f, indent=2)

print(f"\n✅ Saved to: {output_file}")
