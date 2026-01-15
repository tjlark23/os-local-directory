-- Multi-tenant Local Business Directory Schema
-- Run this in Supabase SQL Editor: https://mkhpvpfowrdifclyfksu.supabase.co/project/mkhpvpfowrdifclyfksu/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for listing tiers
CREATE TYPE listing_tier AS ENUM ('free', 'premium', 'featured');

-- Locations table (your 18 brands/tenants)
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#2563eb',
  tagline TEXT,
  cities TEXT[] NOT NULL,
  state VARCHAR(2) DEFAULT 'TX',
  timezone VARCHAR(50) DEFAULT 'America/Chicago',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Businesses table
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  custom_description TEXT,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  image TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  website TEXT,
  address_street VARCHAR(255) NOT NULL,
  address_city VARCHAR(100) NOT NULL,
  address_state VARCHAR(2) NOT NULL,
  address_zip VARCHAR(10) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  hours JSONB NOT NULL DEFAULT '{}',
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  price_range VARCHAR(10),
  year_established INTEGER,
  owner VARCHAR(255),
  specialties TEXT[] DEFAULT '{}',
  amenities JSONB[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  social_links JSONB,
  listing_tier listing_tier DEFAULT 'free',
  is_featured BOOLEAN DEFAULT FALSE,
  premium_since TIMESTAMPTZ,
  backlink_enabled BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure unique slug per location
  UNIQUE(location_id, slug)
);

-- Business inquiries table (leads from "For Businesses" form)
CREATE TABLE business_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  business_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  currently_listed BOOLEAN DEFAULT FALSE,
  interested_in VARCHAR(50) NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_businesses_location_id ON businesses(location_id);
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_listing_tier ON businesses(listing_tier);
CREATE INDEX idx_businesses_address_city ON businesses(address_city);
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_locations_slug ON locations(slug);
CREATE INDEX idx_locations_domain ON locations(domain);
CREATE INDEX idx_business_inquiries_location ON business_inquiries(location_id);
CREATE INDEX idx_business_inquiries_status ON business_inquiries(status);

-- Enable Row Level Security (RLS)
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_inquiries ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Locations are viewable by everyone"
  ON locations FOR SELECT
  USING (true);

CREATE POLICY "Businesses are viewable by everyone"
  ON businesses FOR SELECT
  USING (true);

-- Policy for inserting inquiries (anyone can submit)
CREATE POLICY "Anyone can submit business inquiries"
  ON business_inquiries FOR INSERT
  WITH CHECK (true);

-- For admin operations, we'll use service role key later
-- These policies allow read-only public access

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
