import Header from './Header'
import Hero from './Hero'
import Experience from './Experience'
import Education from './Education'
import Projects from './Projects'
import Testimonials from './Testimonials'
import Skills from './Skills'
import Contact from './Contact'
import Footer from './Footer'
import Chatbot from './Chatbot'
import ScrollToTop from './ScrollToTop'
import Reveal from './Reveal'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <Header />
      <main>
        <Reveal><Hero /></Reveal>
        <Reveal><Experience /></Reveal>
        <Reveal><Education /></Reveal>
        <Reveal><Projects /></Reveal>
        <Reveal><Testimonials /></Reveal>
        <Reveal><Skills /></Reveal>
        <Reveal><Contact /></Reveal>
      </main>
      <Footer />
      <ScrollToTop />
      <Chatbot />
    </div>
  )
}
