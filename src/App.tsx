import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Education from './components/Education'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ChatbotPlaceholder from './components/ChatbotPlaceholder'
import AdminLogin from './components/admin/AdminLogin'
import AdminPanel from './components/admin/AdminPanel'
import { useAuth } from './context/AuthContext'

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
    return user ? <AdminPanel /> : <AdminLogin />
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
      <ChatbotPlaceholder />
    </div>
  )
}

export default App
