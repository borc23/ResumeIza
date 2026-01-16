import { useState } from 'react';
import { useData } from '../context/DataContext';

const FORMSPREE_ID = "xwvvpana";

export default function Contact() {
  const { profile } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch {
      setError('Failed to send message. Please try again or email directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-primary-900/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Get In Touch
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology.
            </p>

            <div className="space-y-4">
              {profile.email && (
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-primary-800/50 rounded-lg shadow border border-primary-100 dark:border-primary-700">
                  <div className="p-3 bg-accent-gradient rounded-lg">
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white font-medium">{profile.email}</p>
                  </div>
                </div>
              )}

              {profile.phone && (
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-primary-800/50 rounded-lg shadow border border-primary-100 dark:border-primary-700">
                  <div className="p-3 bg-accent-gradient rounded-lg">
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-gray-900 dark:text-white font-medium">{profile.phone}</p>
                  </div>
                </div>
              )}

              {profile.location && (
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-primary-800/50 rounded-lg shadow border border-primary-100 dark:border-primary-700">
                  <div className="p-3 bg-accent-gradient rounded-lg">
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-gray-900 dark:text-white font-medium">{profile.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-primary-800/50 rounded-xl p-6 shadow-lg border border-primary-100 dark:border-primary-700">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-primary-200 dark:border-primary-600 rounded-lg bg-white dark:bg-primary-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-primary-200 dark:border-primary-600 rounded-lg bg-white dark:bg-primary-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-primary-200 dark:border-primary-600 rounded-lg bg-white dark:bg-primary-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-accent-gradient hover:opacity-90 disabled:opacity-50 text-gray-900 font-medium rounded-lg transition-all flex items-center justify-center gap-2 glow-orange"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Message
                  </>
                )}
              </button>

              {submitted && (
                <div className="p-4 bg-accent-500/20 text-accent-700 dark:text-accent-400 rounded-lg text-center border border-accent-500/30">
                  Thank you! Your message has been sent.
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-500/20 text-red-700 dark:text-red-400 rounded-lg text-center border border-red-500/30">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
