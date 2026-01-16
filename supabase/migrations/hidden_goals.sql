-- Create hidden_goals table
CREATE TABLE IF NOT EXISTS hidden_goals (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE hidden_goals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read" ON hidden_goals;
DROP POLICY IF EXISTS "Auth write" ON hidden_goals;
DROP POLICY IF EXISTS "Auth delete" ON hidden_goals;

-- RLS Policies
-- Allow public to read hidden goals
CREATE POLICY "Public read" ON hidden_goals
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert, update, and delete
CREATE POLICY "Auth write" ON hidden_goals
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update" ON hidden_goals
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth delete" ON hidden_goals
  FOR DELETE
  USING (auth.role() = 'authenticated');
