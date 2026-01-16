import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { profile, experiences, education, projects, skillCategories } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Only show nav links for sections that have data
  const navLinks = [
    { href: '#about', label: 'About', show: true },
    { href: '#experience', label: 'Experience', show: experiences.length > 0 },
    { href: '#education', label: 'Education', show: education.length > 0 },
    { href: '#projects', label: 'Projects', show: projects.length > 0 },
    { href: '#skills', label: 'Skills', show: skillCategories.length > 0 },
    { href: '#contact', label: 'Contact', show: true },
  ].filter(link => link.show);

  const displayName = profile.name ? profile.name.split(' ')[0] : 'Portfolio';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-primary-800">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="text-xl font-bold text-accent-gradient">
            {displayName}
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-500 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-accent-500 hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-accent-500"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-200 dark:border-primary-700">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-600 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-500"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
