import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nghvfmnxyoziocjvksff.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5naHZmbW54eW96aW9janZrc2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0OTQ0MzAsImV4cCI6MjA4NDA3MDQzMH0.KAtwrdcVjenSRuJi-PgtVVUKnV3hZQvcL-T-OtRpJm8';

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
