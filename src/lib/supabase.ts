import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DbProfile {
  id: number;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  profile_image: string;
  cv_file: string;
  linkedin_url: string | null;
}

export interface DbExperience {
  id: number;
  company: string;
  position: string;
  period: string;
  description: string;
  achievements: string[];
  technologies: string[];
  sort_order: number;
}

export interface DbEducation {
  id: number;
  institution: string;
  degree: string;
  field: string;
  period: string;
  description: string | null;
  achievements: string[] | null;
  sort_order: number;
}

export interface DbProject {
  id: number;
  title: string;
  description: string;
  long_description: string;
  image: string;
  technologies: string[];
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  sort_order: number;
}

export interface DbSkillCategory {
  id: number;
  category: string;
  sort_order: number;
}

export interface DbSkill {
  id: number;
  category_id: number;
  name: string;
  level: number;
  sort_order: number;
}
