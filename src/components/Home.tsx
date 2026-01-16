import Header from './Header'
import Hero from './Hero'
import Experience from './Experience'
import Education from './Education'
import Projects from './Projects'
import Skills from './Skills'
import Contact from './Contact'
import Footer from './Footer'
import Chatbot from './Chatbot'
import ScrollToTop from './ScrollToTop'

export default function Home() {
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
      <ScrollToTop />
      <Chatbot />
    </div>
  )
}
