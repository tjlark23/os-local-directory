import pandas as pd

# Load the first Excel file
df = pd.read_excel(r'C:\Users\tjlar\Downloads\Outscraper-20260116195727m0c.xlsx')

print(f"Total rows in file: {len(df)}")
print(f"Columns: {list(df.columns)}")

# Take first business - should appear in multiple rows
first_business_name = df.iloc[0]['name']
first_place_id = df.iloc[0]['place_id']

same_business_rows = df[df['place_id'] == first_place_id]

print(f"\n{'='*60}")
print(f"Business: {first_business_name}")
print(f"Place ID: {first_place_id}")
print(f"Total rows for this business: {len(same_business_rows)}")
print(f"{'='*60}")
print("PHOTO URLs (should be DIFFERENT in each row):")
print(f"{'='*60}")

# Check for photo column
photo_cols = [c for c in df.columns if 'photo' in c.lower()]
print(f"\nPhoto-related columns found: {photo_cols}")

for i, (idx, row) in enumerate(same_business_rows.iterrows(), 1):
    # Try different possible photo column names
    photo = None
    for col in ['photo', 'photo_url', 'photos', 'main_photo']:
        if col in row and pd.notna(row.get(col)):
            photo = row.get(col)
            break

    # Also check for review columns
    review_text = None
    for col in df.columns:
        if 'review' in col.lower() and 'text' in col.lower():
            review_text = row.get(col)
            break

    print(f"\nRow {i} (index {idx}):")
    print(f"  Photo: {str(photo)[:100] if photo else 'None'}...")
    print(f"  Review: {str(review_text)[:60] if review_text and pd.notna(review_text) else 'None'}...")

print(f"\n{'='*60}")
print("EXPECTED: Each row has a DIFFERENT photo URL")
print("IF TRUE: We have the photos, just need to extract them")
print(f"{'='*60}")

# Show unique values counts
unique_place_ids = df['place_id'].nunique()
unique_names = df['name'].nunique()
print(f"\nUnique place_ids: {unique_place_ids}")
print(f"Unique business names: {unique_names}")
print(f"Rows per business (average): {len(df) / unique_place_ids:.1f}")
