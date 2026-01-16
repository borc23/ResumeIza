import { lazy, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { Helmet } from 'react-helmet-async'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useData } from './context/DataContext'
import Home from './components/Home'

const AdminLogin = lazy(() => import('./components/admin/AdminLogin'))
const AdminPanel = lazy(() => import('./components/admin/AdminPanel'))

function App() {
  const { user, loading } = useAuth()
  const { profile, projects } = useData()

  // SEO Keywords
  const projectKeywords = projects.map(p => p.title).join(', ')

  return (
    <>
      <Helmet>
        <title>{profile.name || 'Portfolio'} | {profile.title || 'Developer'}</title>
        <meta name="description" content={profile.bio || 'Professional Portfolio'} />
        <meta name="keywords" content={`portfolio, resume, developer, ${profile.title}, ${projectKeywords}`} />
        <meta property="og:title" content={`${profile.name || 'Portfolio'} | ${profile.title || 'Developer'}`} />
        <meta property="og:description" content={profile.bio || 'Professional Portfolio'} />
        <meta property="og:image" content={profile.profileImage} />
        <meta property="twitter:card" content="summary_large_image" />
      </Helmet>

      <Toaster position="bottom-right" toastOptions={{
        className: 'dark:bg-primary-800 dark:text-white',
        style: {
          background: '#333',
          color: '#fff',
        },
      }} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/*" element={
          <Suspense fallback={
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-500 border-t-transparent"></div>
            </div>
          }>
            {loading ? (
              <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-500 border-t-transparent"></div>
              </div>
            ) : (
               user ? <AdminPanel /> : <AdminLogin />
            )}
          </Suspense>
        } />
      </Routes>
    </>
  )
}

export default App
