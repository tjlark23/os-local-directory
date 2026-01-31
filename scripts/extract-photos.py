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

# Group by place_id and collect photos
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
            'photos': [],
            'review_photos': []
        }

    # Get main photo (only need once per business)
    photo = row.get('photo')
    if photo and pd.notna(photo) and photo not in business_photos[place_id]['photos']:
        business_photos[place_id]['photos'].append(photo)

    # Get street view (only need once per business)
    street_view = row.get('street_view')
    if street_view and pd.notna(street_view) and street_view not in business_photos[place_id]['photos']:
        # Only add if different from main photo
        if street_view != photo:
            business_photos[place_id]['photos'].append(street_view)

    # Get review photos (can have many)
    review_img = row.get('google_maps_reviews.review_img_url')
    if review_img and pd.notna(review_img):
        if review_img not in business_photos[place_id]['review_photos']:
            business_photos[place_id]['review_photos'].append(review_img)

# Stats
total_businesses = len(business_photos)
with_main_photo = sum(1 for b in business_photos.values() if len(b['photos']) >= 1)
with_review_photos = sum(1 for b in business_photos.values() if len(b['review_photos']) >= 1)
avg_review_photos = sum(len(b['review_photos']) for b in business_photos.values()) / total_businesses if total_businesses > 0 else 0

print(f"\n{'='*60}")
print("EXTRACTION RESULTS:")
print(f"{'='*60}")
print(f"Total businesses: {total_businesses}")
print(f"With main photo: {with_main_photo}")
print(f"With review photos: {with_review_photos}")
print(f"Avg review photos per business: {avg_review_photos:.1f}")

# Combine photos - use main photo + review photos to get up to 5
for place_id, data in business_photos.items():
    # Start with main/street view photos
    all_photos = data['photos'].copy()

    # Add review photos to fill up to 5
    for rp in data['review_photos']:
        if len(all_photos) >= 5:
            break
        if rp not in all_photos:
            all_photos.append(rp)

    data['combined_photos'] = all_photos[:5]

# Stats after combining
with_5_photos = sum(1 for b in business_photos.values() if len(b['combined_photos']) >= 5)
with_3_photos = sum(1 for b in business_photos.values() if len(b['combined_photos']) >= 3)
with_1_photo = sum(1 for b in business_photos.values() if len(b['combined_photos']) == 1)

print(f"\n{'='*60}")
print("COMBINED PHOTOS (main + review photos):")
print(f"{'='*60}")
print(f"With 5+ photos: {with_5_photos}")
print(f"With 3-4 photos: {with_3_photos - with_5_photos}")
print(f"With 1-2 photos: {with_1_photo + (with_3_photos - with_5_photos - with_1_photo)}")
print(f"With only 1 photo: {with_1_photo}")

# Show examples
print(f"\n{'='*60}")
print("SAMPLE (First 5 businesses):")
print(f"{'='*60}")

for place_id, data in list(business_photos.items())[:5]:
    print(f"\n{data['name']} ({data['city']}):")
    print(f"  Main/Street photos: {len(data['photos'])}")
    print(f"  Review photos: {len(data['review_photos'])}")
    print(f"  Combined (max 5): {len(data['combined_photos'])}")
    for i, photo in enumerate(data['combined_photos'], 1):
        print(f"    {i}. {photo[:60]}...")

# Save for database update
output_file = r'C:\Users\tjlar\Desktop\os-local-directory\scripts\extracted_photos.json'
with open(output_file, 'w') as f:
    json.dump(business_photos, f, indent=2)

print(f"\nSaved to: {output_file}")
