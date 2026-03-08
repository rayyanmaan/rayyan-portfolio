import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';

export default function Home() {
  const [activeSection, setActiveSection] = useState('work');

  return (
    <div className="min-h-screen bg-white text-foreground flex">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className="flex-1 ml-0 lg:ml-64">
        <motion.section
          id="work"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen flex items-center justify-center px-6 py-20"
        >
          <Hero />
        </motion.section>

        <motion.section
          id="work"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen flex items-center justify-center px-6 py-20"
        >
          <Projects />
        </motion.section>

        <motion.section
          id="about"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen flex items-center justify-center px-6 py-20"
        >
          <About />
        </motion.section>

        <motion.section
          id="contact"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen flex items-center justify-center px-6 py-20"
        >
          <Contact />
        </motion.section>
      </main>
    </div>
  );
}
