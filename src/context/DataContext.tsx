import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import { supabase, type DbProfile, type DbExperience, type DbEducation, type DbProject, type DbSkillCategory, type DbSkill } from '../lib/supabase';

// Define types for the app's data structures
export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  cvFile: string;
  socialLinks?: {
    linkedin?: string;
  };
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  period: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  period: string;
  description?: string;
  achievements?: string[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface SkillCategory {
  id: number;
  category: string;
  skills: {
    name: string;
    level: number;
  }[];
}

// Empty default states
const emptyProfile: Profile = {
  name: '',
  title: '',
  bio: '',
  email: '',
  phone: '',
  location: '',
  profileImage: '',
  cvFile: '',
  socialLinks: {},
};

interface DataContextType {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skillCategories: SkillCategory[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  // CRUD operations
  updateProfile: (data: Partial<DbProfile>) => Promise<void>;
  addExperience: (data: Omit<DbExperience, 'id'>) => Promise<void>;
  updateExperience: (id: number, data: Partial<DbExperience>) => Promise<void>;
  deleteExperience: (id: number) => Promise<void>;
  addEducation: (data: Omit<DbEducation, 'id'>) => Promise<void>;
  updateEducation: (id: number, data: Partial<DbEducation>) => Promise<void>;
  deleteEducation: (id: number) => Promise<void>;
  addProject: (data: Omit<DbProject, 'id'>) => Promise<void>;
  updateProject: (id: number, data: Partial<DbProject>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  addSkillCategory: (data: Omit<DbSkillCategory, 'id'>) => Promise<void>;
  updateSkillCategory: (id: number, data: Partial<DbSkillCategory>) => Promise<void>;
  deleteSkillCategory: (id: number) => Promise<void>;
  addSkill: (data: Omit<DbSkill, 'id'>) => Promise<void>;
  updateSkill: (id: number, data: Partial<DbSkill>) => Promise<void>;
  deleteSkill: (id: number) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      }

      if (profileData) {
        setProfile({
          name: profileData.name,
          title: profileData.title,
          bio: profileData.bio,
          email: profileData.email,
          phone: profileData.phone,
          location: profileData.location,
          profileImage: profileData.profile_image,
          cvFile: profileData.cv_file,
          socialLinks: {
            linkedin: profileData.linkedin_url || undefined,
          },
        });
      }

      // Fetch experiences
      const { data: experiencesData } = await supabase
        .from('experiences')
        .select('*')
        .order('sort_order', { ascending: true });

      if (experiencesData) {
        setExperiences(experiencesData.map(exp => ({
          id: exp.id,
          company: exp.company,
          position: exp.position,
          period: exp.period,
          description: exp.description,
          achievements: exp.achievements || [],
          technologies: exp.technologies || [],
        })));
      }

      // Fetch education
      const { data: educationData } = await supabase
        .from('education')
        .select('*')
        .order('sort_order', { ascending: true });

      if (educationData) {
        setEducation(educationData.map(edu => ({
          id: edu.id,
          institution: edu.institution,
          degree: edu.degree,
          field: edu.field,
          period: edu.period,
          description: edu.description || undefined,
          achievements: edu.achievements || undefined,
        })));
      }

      // Fetch projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (projectsData) {
        setProjects(projectsData.map(proj => ({
          id: proj.id,
          title: proj.title,
          description: proj.description,
          longDescription: proj.long_description,
          image: proj.image,
          technologies: proj.technologies || [],
          liveUrl: proj.live_url || undefined,
          githubUrl: proj.github_url || undefined,
          featured: proj.featured,
        })));
      }

      // Fetch skill categories with skills
      const { data: categoriesData } = await supabase
        .from('skill_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .order('sort_order', { ascending: true });

      if (categoriesData) {
        setSkillCategories(categoriesData.map(cat => ({
          id: cat.id,
          category: cat.category,
          skills: (skillsData || [])
            .filter(skill => skill.category_id === cat.id)
            .map(skill => ({
              name: skill.name,
              level: skill.level,
            })),
        })));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(message);
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = async () => {
    setLoading(true);
    await fetchData();
  };

  // Profile CRUD
  const updateProfile = async (data: Partial<DbProfile>) => {
    const { error } = await supabase.from('profile').update(data).eq('id', 1);
    if (error) throw error;
    await refreshData();
  };

  // Experience CRUD
  const addExperience = async (data: Omit<DbExperience, 'id'>) => {
    const { error } = await supabase.from('experiences').insert(data);
    if (error) throw error;
    await refreshData();
  };

  const updateExperience = async (id: number, data: Partial<DbExperience>) => {
    const { error } = await supabase.from('experiences').update(data).eq('id', id);
    if (error) throw error;
    await refreshData();
  };

  const deleteExperience = async (id: number) => {
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) throw error;
    await refreshData();
  };

  // Education CRUD
  const addEducation = async (data: Omit<DbEducation, 'id'>) => {
    const { error } = await supabase.from('education').insert(data);
    if (error) throw error;
    await refreshData();
  };

  const updateEducation = async (id: number, data: Partial<DbEducation>) => {
    const { error } = await supabase.from('education').update(data).eq('id', id);
    if (error) throw error;
    await refreshData();
  };

  const deleteEducation = async (id: number) => {
    const { error } = await supabase.from('education').delete().eq('id', id);
    if (error) throw error;
    await refreshData();
  };

  // Project CRUD
  const addProject = async (data: Omit<DbProject, 'id'>) => {
    const { error } = await supabase.from('projects').insert(data);
    if (error) throw error;
    await refreshData();
  };

  const updateProject = async (id: number, data: Partial<DbProject>) => {
    const { error } = await supabase.from('projects').update(data).eq('id', id);
    if (error) throw error;
    await refreshData();
  };

  const deleteProject = async (id: number) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    await refreshData();
  };

  // Skill Category CRUD
  const addSkillCategory = async (data: Omit<DbSkillCategory, 'id'>) => {
    const { error } = await supabase.from('skill_categories').insert(data);
    if (error) throw error;
    await refreshData();
  };

  const updateSkillCategory = async (id: number, data: Partial<DbSkillCategory>) => {
    const { error } = await supabase.from('skill_categories').update(data).eq('id', id);
    if (error) throw error;
    await refreshData();
  };

  const deleteSkillCategory = async (id: number) => {
    const { error } = await supabase.from('skill_categories').delete().eq('id', id);
    if (error) throw error;
    await refreshData();
  };

  // Skill CRUD
  const addSkill = async (data: Omit<DbSkill, 'id'>) => {
    const { error } = await supabase.from('skills').insert(data);
    if (error) throw error;
    await refreshData();
  };

  const updateSkill = async (id: number, data: Partial<DbSkill>) => {
    const { error } = await supabase.from('skills').update(data).eq('id', id);
    if (error) throw error;
    await refreshData();
  };

  const deleteSkill = async (id: number) => {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
    await refreshData();
  };

  return (
    <DataContext.Provider value={{
      profile,
      experiences,
      education,
      projects,
      skillCategories,
      loading,
      error,
      refreshData,
      updateProfile,
      addExperience,
      updateExperience,
      deleteExperience,
      addEducation,
      updateEducation,
      deleteEducation,
      addProject,
      updateProject,
      deleteProject,
      addSkillCategory,
      updateSkillCategory,
      deleteSkillCategory,
      addSkill,
      updateSkill,
      deleteSkill,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
