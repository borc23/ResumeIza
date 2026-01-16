import { useEffect, useState, lazy, Suspense } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Education from './components/Education'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import { useAuth } from './context/AuthContext'

const AdminLogin = lazy(() => import('./components/admin/AdminLogin'))
const AdminPanel = lazy(() => import('./components/admin/AdminPanel'))

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const { user, loading } = useAuth()

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Admin routes
  if (currentPath === '/admin' || currentPath === '/admin/') {
    if (loading) {
      return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-500 border-t-transparent"></div>
        </div>
      )
    }
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-500 border-t-transparent"></div>
        </div>
      }>
        {user ? <AdminPanel /> : <AdminLogin />}
      </Suspense>
    )
  }

  // Main portfolio
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <Header />
      <main>
        <Hero />
        <Experience />
        <Education />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default App
