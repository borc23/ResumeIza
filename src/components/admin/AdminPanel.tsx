import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import ProfileEditor from './ProfileEditor';
import ExperienceEditor from './ExperienceEditor';
import EducationEditor from './EducationEditor';
import ProjectsEditor from './ProjectsEditor';
import SkillsEditor from './SkillsEditor';
import HiddenGoalsEditor from './HiddenGoalsEditor';
import TestimonialsEditor from './TestimonialsEditor';

type Tab = 'profile' | 'experience' | 'education' | 'projects' | 'skills' | 'hidden_goals' | 'testimonials';

export default function AdminPanel() {
  const { signOut, user } = useAuth();
  const { loading } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'hidden_goals', label: 'Hidden Goals' },
    { id: 'testimonials', label: 'Testimonials' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-primary-900/50 shadow-sm border-b border-gray-200 dark:border-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </span>
              <a
                href="/"
                className="text-sm text-accent-600 dark:text-accent-500 hover:underline"
              >
                View Site
              </a>
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-primary-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-primary-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-accent-gradient text-gray-900'
                  : 'bg-white dark:bg-primary-900/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-primary-900/30 rounded-xl shadow-lg border border-gray-200 dark:border-primary-700 p-6">
          {activeTab === 'profile' && <ProfileEditor />}
          {activeTab === 'experience' && <ExperienceEditor />}
          {activeTab === 'education' && <EducationEditor />}
          {activeTab === 'projects' && <ProjectsEditor />}
          {activeTab === 'hidden_goals' && <HiddenGoalsEditor />}
          {activeTab === 'skills' && <SkillsEditor />}
          {activeTab === 'testimonials' && <TestimonialsEditor />}
        </div>
      </div>
    </div>
  );
}
