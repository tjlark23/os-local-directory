import pandas as pd

# Check photo file structure
photo_file = r'C:\Users\tjlar\Downloads\Cedar_Park_Restaurants_Photos_Fixed.xlsx'
df = pd.read_excel(photo_file)

print("PHOTO FILE STRUCTURE")
print(f"{'='*60}")
print(f"File: Cedar_Park_Restaurants_Photos_Fixed.xlsx")
print(f"Rows: {len(df)}")
print(f"Columns: {len(df.columns)}")
print(f"\nColumn names:")
for i, col in enumerate(df.columns):
    print(f"  {i+1}. {col}")

print(f"\n{'='*60}")
print("SAMPLE ROW (first business):")
print(f"{'='*60}")
first_row = df.iloc[0]
print(f"Business name: {first_row.get('name', first_row.iloc[0])}")

# Find photo columns
photo_cols = [c for c in df.columns if 'photo' in c.lower() or 'Photo' in c]
print(f"\nPhoto columns found: {len(photo_cols)}")
for col in photo_cols[:5]:
    val = first_row.get(col)
    print(f"  {col}: {str(val)[:60]}...")

# Check review file structure
print(f"\n\n{'='*60}")
print("REVIEW FILE STRUCTURE")
print(f"{'='*60}")

review_file = r'C:\Users\tjlar\Downloads\Cedar_Park_Restaurants_Reviews_Fixed.xlsx'
df_rev = pd.read_excel(review_file)

print(f"File: Cedar_Park_Restaurants_Reviews_Fixed.xlsx")
print(f"Rows: {len(df_rev)}")
print(f"Columns: {len(df_rev.columns)}")
print(f"\nColumn names (first 30):")
for i, col in enumerate(df_rev.columns[:30]):
    print(f"  {i+1}. {col}")

# Find review-related columns
review_cols = [c for c in df_rev.columns if 'review' in c.lower() or 'Review' in c]
print(f"\nReview-related columns: {len(review_cols)}")
print("Sample review columns:")
for col in review_cols[:10]:
    print(f"  - {col}")
