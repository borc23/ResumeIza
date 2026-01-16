import { useData } from '../context/DataContext';

export default function Testimonials() {
  const { testimonials, loading } = useData();

  if (loading) {
    return null; // Or use a skeleton
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          What People Say
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-primary-800/50 rounded-xl p-6 shadow-lg border border-primary-100 dark:border-primary-700 flex flex-col"
            >
              {/* Quote Icon */}
              <div className="mb-4 text-accent-500">
                <svg className="w-8 h-8 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21L14.017 18C14.017 16.0547 15.1924 14.6334 16.7793 14.2832C16.9922 14.2402 17.1592 14.0537 17.1592 13.8223V12.1797C17.1592 11.9707 17.0098 11.7773 16.8047 11.75C15.541 11.5869 14.017 10.6035 14.017 8.05469V6C14.017 5.44727 14.4648 5 15.0176 5H18.0176C18.5703 5 19.0176 5.44727 19.0176 6V11C19.0176 13.7852 16.7578 15.3984 15.5439 16.5918C18.2588 17.5117 19.0176 18.0059 19.0176 20C19.0176 20.5527 18.5703 21 18.0176 21H14.017ZM8.01758 21L8.01758 18C8.01758 16.0547 9.19238 14.6334 10.7793 14.2832C10.9922 14.2402 11.1592 14.0537 11.1592 13.8223V12.1797C11.1592 11.9707 11.0098 11.7773 10.8047 11.75C9.54102 11.5869 8.01758 10.6035 8.01758 8.05469V6C8.01758 5.44727 8.46484 5 9.01758 5H12.0176C12.5703 5 13.0176 5.44727 13.0176 6V11C13.0176 13.7852 10.7578 15.3984 9.54395 16.5918C12.2588 17.5117 13.0176 18.0059 13.0176 20C13.0176 20.5527 12.5703 21 12.0176 21H8.01758Z" />
                </svg>
              </div>

              {/* Content */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic flex-grow">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-primary-700 flex-shrink-0">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random`;
                      }}
                    />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-lg">
                       {testimonial.name[0]}
                     </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-accent-600 dark:text-accent-500 text-xs">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
