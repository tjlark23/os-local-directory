# Launch a New City Directory in 2 Hours

This guide explains how to replicate WilCo Guide for a different city or region.

## Prerequisites

- Node.js 18+
- Supabase account
- Vercel account (optional, for deployment)
- Outscraper API key (for data)

## Quick Start (2 Hours)

### Hour 1: Setup & Configuration

#### 1. Clone the Repository (5 min)

```bash
git clone <your-repo-url> austin-guide
cd austin-guide
npm install
```

#### 2. Create Supabase Project (10 min)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy the URL and anon key
4. Run migrations:

```bash
npx supabase db push
```

#### 3. Configure Environment (5 min)

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
STRIPE_SECRET_KEY=sk_live_xxx (optional)
STRIPE_WEBHOOK_SECRET=whsec_xxx (optional)
```

#### 4. Update Site Configuration (10 min)

Edit `lib/site-config.ts`:

```typescript
export const siteConfig = {
  name: "Austin Guide",
  url: "https://austinguide.com",
  tagline: "Your Complete Guide to Austin",
  description: "Your complete guide to Austin - news, businesses, jobs and more",
  email: "hello@austinguide.com",
  // Update city lists
  allCities: [
    "Austin", "Round Rock", "Cedar Park",
    "Georgetown", "Pflugerville", "Leander"
  ],
}
```

#### 5. Update Location Configuration (15 min)

Edit `lib/locations-config.ts`:

```typescript
export const CITIES: CityConfig[] = [
  {
    slug: 'austin-tx',
    name: 'Austin',
    state: 'TX',
    fullName: 'Austin, TX',
    region: 'Travis County',
    hasData: true,
    subdivisions: [
      { slug: 'downtown-austin-tx', name: 'Downtown', parentCity: 'Austin' },
      { slug: 'south-congress-austin-tx', name: 'South Congress', parentCity: 'Austin' },
      // Add more neighborhoods
    ]
  },
  // Add more cities
]
```

#### 6. Create Location in Database (5 min)

```sql
INSERT INTO locations (slug, name, domain, cities, state)
VALUES (
  'austin',
  'Austin Guide',
  'austinguide.com',
  ARRAY['Austin', 'Round Rock', 'Cedar Park', 'Georgetown'],
  'TX'
);
```

### Hour 2: Import Data & Deploy

#### 1. Scrape Business Data (30 min)

Use Outscraper to scrape businesses:

```python
# scripts/scrape-austin.py
import outscraper

client = outscraper.ApiClient(api_key='your-key')

# Scrape restaurants
results = client.google_maps_search(
    query='restaurants Austin TX',
    limit=200,
    reviews_limit=10
)

# Save to CSV
import pandas as pd
df = pd.DataFrame(results)
df.to_csv('austin-restaurants.csv', index=False)
```

#### 2. Import to Database (15 min)

```bash
# Use existing import script, update for your data
node scripts/import-outscraper.js austin-restaurants.csv
```

#### 3. Verify Data (5 min)

```bash
# Check business counts
node scripts/validate-programmatic-seo.js
```

#### 4. Deploy to Vercel (10 min)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Add custom domain
```

## Detailed Configuration

### Categories

The system supports these categories by default:

| Category | Database Value | Display Name |
|----------|---------------|--------------|
| Restaurants | `restaurants` | Restaurants |
| Health | `health` | Health & Wellness |
| Beauty | `beauty` | Beauty & Spa |
| Fitness | `fitness` | Fitness & Sports |
| Auto | `automotive` | Auto Services |
| Shopping | `shopping` | Shopping & Retail |
| Services | `services` | Professional Services |
| Education | `education` | Education |
| Pets | `pets` | Pets & Animals |
| Financial | `financial` | Financial Services |
| Home | `home` | Home Services |
| Entertainment | `entertainment` | Entertainment |

To add new categories, edit:
- `app/(public)/[category]/[city]/page.tsx` - `VALID_CATEGORIES` array
- `components/programmatic/CategoryCityTemplate.tsx` - `CATEGORY_DISPLAY_NAMES`

### Database Schema

The minimum required tables:

```sql
-- Locations (your site/region)
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  domain TEXT,
  cities TEXT[] NOT NULL,
  state TEXT DEFAULT 'TX',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Businesses
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES locations(id),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  image TEXT,
  photos TEXT[],
  phone TEXT,
  website TEXT,
  address_street TEXT,
  address_city TEXT NOT NULL,
  address_state TEXT NOT NULL,
  address_zip TEXT,
  latitude FLOAT,
  longitude FLOAT,
  rating FLOAT DEFAULT 0,
  review_count INT DEFAULT 0,
  price_range TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews (optional but recommended)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  review_id TEXT NOT NULL,
  author_name TEXT,
  rating INT,
  text TEXT,
  review_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Outscraper Data Import

The import process expects Outscraper CSV format:

```csv
name,full_address,city,state,postal_code,category,rating,reviews,phone,site,photo
"Joe's Pizza","123 Main St","Austin","TX","78701","Restaurant",4.5,150,"512-555-1234","joespizza.com","https://..."
```

The import script normalizes:
- Categories to our category slugs
- City names to exact match
- Photos to array format
- Hours to JSON format

### Branding Customization

1. **Logo**: Replace `/public/logo.svg`
2. **Favicon**: Replace `/public/favicon.ico`
3. **Colors**: Edit `app/globals.css` (uses CSS variables)
4. **Font**: Edit `app/layout.tsx` (uses Inter by default)

### Stripe Setup (Optional)

For premium listings:

1. Create Stripe account
2. Create product and price ($49/month or your pricing)
3. Set environment variables:

```env
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_FEATURED_PRICE_ID=price_xxx
```

4. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`

## Data Quality Checklist

Before launch:

- [ ] At least 100 businesses per major category
- [ ] At least 10 reviews per business (avg)
- [ ] Photos for 50%+ of businesses
- [ ] All cities have at least 50 businesses
- [ ] No duplicate businesses
- [ ] Valid phone numbers and websites

## Estimated Costs

| Item | Cost |
|------|------|
| Outscraper (1000 businesses) | $10-20 |
| Supabase (Free tier) | $0 |
| Vercel (Hobby) | $0 |
| Domain | $10-15/year |
| **Total** | **$20-35** |

## Post-Launch

1. **Submit to Google Search Console**
2. **Submit sitemap**: `https://yourdomain.com/sitemap.xml`
3. **Monitor rankings** for top category+city keywords
4. **Add more reviews** for cities with low counts
5. **Enable Stripe** for monetization

## Troubleshooting

### "No businesses found"
- Check location_id matches
- Check category values match exactly
- Check city names match (case-insensitive)

### Build fails
- Run `npm run build` locally first
- Check TypeScript errors (some can be ignored)
- Ensure env variables are set

### Pages show wrong data
- Clear `.next` cache: `rm -rf .next`
- Rebuild: `npm run build`

## Support

For issues specific to this codebase, check:
1. `docs/PROGRAMMATIC_SEO_SETUP.md` - How the SEO system works
2. `docs/PROGRAMMATIC_SEO_REPORT.md` - Current data status
3. `scripts/validate-programmatic-seo.js` - Debug data issues
