import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-50 dark:bg-primary-900/30 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-primary-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Admin Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 dark:border-primary-600 rounded-lg bg-white dark:bg-primary-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 dark:border-primary-600 rounded-lg bg-white dark:bg-primary-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent-gradient hover:opacity-90 disabled:opacity-50 text-gray-900 font-medium rounded-lg transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <a href="/" className="text-accent-600 dark:text-accent-500 hover:underline">
              ← Back to website
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
