import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Logo from '@/components/Logo';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Builds from '@/components/Builds';
import Stack from '@/components/Stack';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { LOGO_SRC } from '@/logoData';

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function Home() {
  const [activeSection, setActiveSection] = useState('me');

  const renderPage = () => {
    switch (activeSection) {
      case 'me':     return <Hero />;
      case 'work':   return <Projects />;
      case 'builds': return <Builds />;
      case 'stack':  return <Stack />;
      case 'contact': return <Contact />;
      default:       return <Hero />;
    }
  };

  return (
    <div
      className="min-h-screen text-[#1a1a1a] overflow-hidden"
      style={{ background: '#f8f7f4', fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Logo — top left, wiggle on hover */}
      <Logo onClick={() => setActiveSection('me')} src={LOGO_SRC} />

      {/* Centered pill nav */}
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Page content */}
      <main
        className="fixed inset-0 overflow-y-auto"
        style={{ paddingTop: 64, paddingBottom: 64 }}
      >
        <div className="min-h-full px-[72px] py-14 max-w-[1240px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <Footer logoSrc={LOGO_SRC} setActiveSection={setActiveSection} />
    </div>
  );
}
