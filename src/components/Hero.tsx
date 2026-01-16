import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import floatingImage from '../assets/Image-removebg-preview.png';
import { HeroSkeleton } from './Skeletons';

export default function Hero() {
  const { profile, loading } = useData();
  const [displayText, setDisplayText] = useState('');
  const [rotationIndex, setRotationIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!profile.title) return;

    const titles = profile.title.includes(',') 
      ? profile.title.split(',').map(t => t.trim()) 
      : [profile.title];
    
    // If only one title, just set it and return (no animation loop)
    if (titles.length <= 1) {
      setDisplayText(titles[0]);
      return;
    }

    const currentFullText = titles[rotationIndex % titles.length];
    const typeSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentFullText.substring(0, displayText.length + 1));
        if (displayText === currentFullText) {
           // Wait longer before deleting
           setTimeout(() => setIsDeleting(true), 2000);
           return;
        }
      } else {
        setDisplayText(currentFullText.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setRotationIndex(prev => prev + 1);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, profile.title, rotationIndex]);

  if (loading) {
    return (
      <section id="about" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <HeroSkeleton />
      </section>
    );
  }

  if (!profile.name) {
    return (
      <section id="about" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-gray-500 dark:text-gray-400">
          <p>No profile data available. Please add your profile in the admin panel.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle orange glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-700/5 via-transparent to-primary-500/10 dark:from-accent-700/10 dark:to-primary-500/20 pointer-events-none"></div>

      {/* Floating decorative image */}
      <div className="absolute bottom-0 right-0 md:right-10 lg:right-20 pointer-events-none opacity-80 hidden md:block">
        <img
          src={floatingImage}
          alt=""
          className="w-48 lg:w-64 h-auto animate-float"
        />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden ring-4 ring-accent-600 ring-offset-4 ring-offset-white dark:ring-offset-primary-900 glow-orange">
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=256&background=7B2CBF&color=fff`;
                }}
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              {profile.name}
            </h1>
            <p className="text-xl md:text-2xl text-accent-gradient font-medium mb-4 h-8">
              {displayText}
              {!profile.title?.includes(',') && displayText === profile.title ? '' : <span className="animate-pulse">|</span>}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mb-6 whitespace-pre-line">
              {profile.bio}
            </p>

            {/* Quick Info */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
              {profile.location && (
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profile.location}
                </span>
              )}
              {profile.email && (
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {profile.email}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {profile.cvFile && (
                <a
                  href={profile.cvFile}
                  download
                  className="px-6 py-3 bg-accent-gradient hover:opacity-90 text-gray-900 font-medium rounded-lg transition-all flex items-center gap-2 glow-orange"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download CV
                </a>
              )}
              <a
                href="#contact"
                className="px-6 py-3 border-2 border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400 hover:bg-primary-500/10 font-medium rounded-lg transition-colors"
              >
                Contact Me
              </a>
            </div>

            {/* Social Links */}
            {profile.socialLinks?.linkedin && (
              <div className="flex justify-center md:justify-start gap-4 mt-6">
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-accent-600 dark:hover:text-accent-500 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
