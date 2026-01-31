-- Temporary RLS policy to allow inserts for data import
-- Run this in Supabase SQL Editor before running the import script
-- After import is complete, you can remove this policy

-- Allow inserts to locations table
CREATE POLICY "Allow inserts for data import"
  ON locations FOR INSERT
  WITH CHECK (true);

-- Allow inserts to businesses table
CREATE POLICY "Allow inserts for data import"
  ON businesses FOR INSERT
  WITH CHECK (true);

-- To remove these policies after import:
-- DROP POLICY "Allow inserts for data import" ON locations;
-- DROP POLICY "Allow inserts for data import" ON businesses;
