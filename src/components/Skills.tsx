import { useData, type SkillCategory } from '../context/DataContext';
import { SkillsSkeleton } from './Skeletons';

export default function Skills() {
  const { skillCategories, loading } = useData();

  const getSkillBarWidth = (level: number) => {
    return `${(level / 5) * 100}%`;
  };

  if (loading) {
    return (
      <section id="skills" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Skills & Expertise
          </h2>
          <SkillsSkeleton />
        </div>
      </section>
    );
  }

  // Hide entire section if no data
  if (skillCategories.length === 0) {
    return null;
  }

  return (
    <section id="skills" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Skills & Expertise
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {skillCategories.map((category: SkillCategory) => (
            <div
              key={category.id}
              className="bg-white dark:bg-primary-800/50 rounded-xl p-6 shadow-lg border border-primary-100 dark:border-primary-700"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-500 rounded-full"></span>
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.skills.map((skill: { name: string; level: number }) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {skill.name}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {skill.level === 5 ? 'Expert' :
                         skill.level === 4 ? 'Advanced' :
                         skill.level === 3 ? 'Intermediate' :
                         skill.level === 2 ? 'Basic' : 'Beginner'}
                      </span>
                    </div>
                    <div className="h-2 bg-primary-100 dark:bg-primary-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-gradient rounded-full transition-all duration-500"
                        style={{ width: getSkillBarWidth(skill.level) }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
