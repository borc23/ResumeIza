import { useData, type Education as EducationType } from '../context/DataContext';

export default function Education() {
  const { education, loading } = useData();

  if (loading) {
    return (
      <section id="education" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-500 border-t-transparent"></div>
        </div>
      </section>
    );
  }

  // Hide entire section if no data
  if (education.length === 0) {
    return null;
  }

  return (
    <section id="education" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Education
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {education.map((edu: EducationType) => (
            <div
              key={edu.id}
              className="bg-white dark:bg-primary-800/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-accent-500"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent-gradient rounded-lg">
                  <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-700/50 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
                    {edu.period}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-primary-600 dark:text-accent-500 font-medium">
                    {edu.institution}
                  </p>
                  {edu.description && (
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      {edu.description}
                    </p>
                  )}
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {edu.achievements.map((achievement: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                          <svg className="w-4 h-4 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
