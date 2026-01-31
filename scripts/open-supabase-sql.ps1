# Opens Supabase SQL Editor with the CREATE TABLE query pre-loaded
$sql = @"
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    author_name TEXT,
    author_id TEXT,
    author_image TEXT,
    author_link TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    review_date TIMESTAMPTZ,
    review_timestamp BIGINT,
    review_id TEXT UNIQUE NOT NULL,
    review_link TEXT,
    likes INTEGER DEFAULT 0,
    owner_response TEXT,
    owner_response_date TIMESTAMPTZ,
    source TEXT DEFAULT 'google',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_review_id ON reviews(review_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Service role can insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update reviews" ON reviews FOR UPDATE USING (true);
"@

# Copy SQL to clipboard
$sql | Set-Clipboard

Write-Host "SQL copied to clipboard!"
Write-Host ""
Write-Host "Opening Supabase SQL Editor..."
Write-Host "Just press Ctrl+V to paste, then click 'Run'"

# Open the SQL editor
Start-Process "https://supabase.com/dashboard/project/wdodhzqgmumrwgfihagc/sql/new"
