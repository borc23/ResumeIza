import { useData, type Experience as ExperienceType } from '../context/DataContext';
import { ExperienceSkeleton } from './Skeletons';

export default function Experience() {
  const { experiences, loading } = useData();

  if (loading) {
    return (
      <section id="experience" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-primary-900/30">
         <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Work Experience
          </h2>
          <div className="relative">
             <div className="absolute left-0 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-gray-200 dark:bg-primary-800/50"></div>
             <div className="space-y-12">
               {[1, 2, 3].map((i) => (
                 <ExperienceSkeleton key={i} />
               ))}
             </div>
          </div>
        </div>
      </section>
    );
  }

  // Hide entire section if no data
  if (experiences.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-primary-900/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Work Experience
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-gradient-to-b from-accent-500 via-primary-500 to-accent-500"></div>

          <div className="space-y-12">
            {experiences.map((exp: ExperienceType, index: number) => (
              <div
                key={exp.id}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent-500 rounded-full border-4 border-white dark:border-primary-900"></div>

                {/* Content */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} pl-8 md:pl-0`}>
                  <div className="bg-white dark:bg-primary-800/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-primary-100 dark:border-primary-700">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-accent-gradient text-gray-900 text-sm font-medium rounded-full">
                        {exp.period}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {exp.position}
                    </h3>
                    <p className="text-primary-600 dark:text-accent-500 font-medium mb-3">
                      {exp.company}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {exp.description}
                    </p>

                    {/* Achievements */}
                    {exp.achievements.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {exp.achievements.map((achievement: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                            <svg className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Technologies */}
                    {exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech: string) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-primary-100 dark:bg-primary-700/50 text-primary-700 dark:text-primary-300 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
