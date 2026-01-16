-- Supabase Schema for Resume Portfolio
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard -> SQL Editor)

-- =============================================
-- 1. PROFILE TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profile (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  profile_image TEXT,
  cv_file TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default profile (update with your info)
INSERT INTO profile (id, name, title, bio, email, phone, location, profile_image, cv_file, linkedin_url)
VALUES (
  1,
  'Your Name',
  'Your Title',
  'Your bio goes here. Write a brief introduction about yourself.',
  'your.email@example.com',
  '+1 234 567 890',
  'Your City, Country',
  '/profile.jpg',
  '/cv.pdf',
  'https://linkedin.com/in/yourprofile'
) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 2. EXPERIENCES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS experiences (
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  achievements TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. EDUCATION TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS education (
  id SERIAL PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  achievements TEXT[],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. PROJECTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  image TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. SKILL CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS skill_categories (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. SKILLS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INTEGER CHECK (level >= 1 AND level <= 5) DEFAULT 3,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (anyone can view the portfolio)
CREATE POLICY "Public read access" ON profile FOR SELECT USING (true);
CREATE POLICY "Public read access" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read access" ON education FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skill_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);

-- Authenticated users can modify data (only logged-in admins)
CREATE POLICY "Authenticated users can insert" ON profile FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON profile FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete" ON profile FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON experiences FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON experiences FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete" ON experiences FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON education FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON education FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete" ON education FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete" ON projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON skill_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON skill_categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete" ON skill_categories FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON skills FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON skills FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete" ON skills FOR DELETE TO authenticated USING (true);

-- =============================================
-- INDEXES FOR BETTER PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_experiences_sort_order ON experiences(sort_order);
CREATE INDEX IF NOT EXISTS idx_education_sort_order ON education(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_skill_categories_sort_order ON skill_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_skills_category_id ON skills(category_id);
CREATE INDEX IF NOT EXISTS idx_skills_sort_order ON skills(sort_order);

-- =============================================
-- SAMPLE DATA (Optional - uncomment to add sample data)
-- =============================================

/*
-- Sample Experiences
INSERT INTO experiences (company, position, period, description, achievements, technologies, sort_order) VALUES
('Company Name', 'Senior Developer', 'Jan 2022 - Present', 'Lead development of web applications',
 ARRAY['Led team of 5 developers', 'Improved performance by 40%'],
 ARRAY['React', 'TypeScript', 'Node.js'], 0),
('Previous Company', 'Developer', 'Jun 2019 - Dec 2021', 'Full-stack development',
 ARRAY['Built customer portal', 'Implemented CI/CD'],
 ARRAY['Vue.js', 'Python', 'PostgreSQL'], 1);

-- Sample Education
INSERT INTO education (institution, degree, field, period, achievements, sort_order) VALUES
('University Name', 'Master of Science', 'Computer Science', '2017 - 2019',
 ARRAY['Graduated with honors', 'Research in AI'], 0),
('University Name', 'Bachelor of Science', 'Computer Science', '2013 - 2017',
 ARRAY['Dean''s List'], 1);

-- Sample Skill Categories and Skills
INSERT INTO skill_categories (category, sort_order) VALUES ('Frontend', 0), ('Backend', 1), ('Database', 2), ('DevOps', 3);

INSERT INTO skills (category_id, name, level, sort_order) VALUES
(1, 'React', 5, 0), (1, 'TypeScript', 4, 1), (1, 'Tailwind CSS', 4, 2),
(2, 'Node.js', 4, 0), (2, 'Python', 3, 1),
(3, 'PostgreSQL', 4, 0), (3, 'MongoDB', 3, 1),
(4, 'Docker', 3, 0), (4, 'Git', 5, 1);

-- Sample Projects
INSERT INTO projects (title, description, long_description, image, technologies, live_url, github_url, featured, sort_order) VALUES
('Project One', 'A brief description', 'A longer detailed description of the project...', '/projects/project1.jpg',
 ARRAY['React', 'Node.js', 'PostgreSQL'], 'https://project1.com', 'https://github.com/user/project1', true, 0);
*/
