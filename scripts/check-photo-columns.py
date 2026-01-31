import pandas as pd

# Load the first Excel file
df = pd.read_excel(r'C:\Users\tjlar\Downloads\Outscraper-20260116195727m0c.xlsx')

print("Looking for all photo-related columns and data...")
print(f"{'='*60}")

# Get first business data
first_place_id = df.iloc[0]['place_id']
first_row = df.iloc[0]

# Print all columns containing 'photo'
photo_cols = [c for c in df.columns if 'photo' in c.lower()]
print(f"\nPhoto-related columns: {photo_cols}")

for col in photo_cols:
    val = first_row.get(col)
    print(f"\n{col}:")
    print(f"  Value: {str(val)[:200] if pd.notna(val) else 'None'}")

# Also check if there are any columns with URLs that might be photos
print(f"\n{'='*60}")
print("Checking for columns with Google URLs that could be photos:")
print(f"{'='*60}")

for col in df.columns:
    val = first_row.get(col)
    if pd.notna(val) and isinstance(val, str) and 'googleusercontent' in str(val).lower():
        print(f"\n{col}:")
        print(f"  {str(val)[:150]}...")

# Check the photos_count column
print(f"\n{'='*60}")
print("Photos count distribution:")
print(f"{'='*60}")

unique_businesses = df.drop_duplicates(subset=['place_id'])
print(f"Unique businesses: {len(unique_businesses)}")
print(f"\nphotos_count distribution:")
print(unique_businesses['photos_count'].describe())

# Check review_img_url column
print(f"\n{'='*60}")
print("Review image URLs (could these be photos?):")
print(f"{'='*60}")

for i, row in df.head(10).iterrows():
    review_img = row.get('google_maps_reviews.review_img_url')
    if pd.notna(review_img) and review_img:
        print(f"Row {i}: {str(review_img)[:100]}...")
