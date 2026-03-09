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
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  const renderPage = () => {
    switch (activeSection) {
      case 'me': return <Hero />;
      case 'work': return <Projects />;
      case 'builds': return <Builds />;
      case 'stack': return <Stack />;
      case 'contact': return <Contact />;
      default: return <Hero />;
    }
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div
        className="min-h-screen text-foreground overflow-hidden bg-background transition-colors duration-500"
      >
        {/* Logo — top left */}
        <Logo
          onClick={toggleTheme}
          src={LOGO_SRC}
          isDark={isDark}
        />

        {/* Navigation */}
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

        {/* Page content */}
        <main
          className="fixed inset-0 overflow-y-auto"
          style={{ paddingTop: 80, paddingBottom: 80 }}
        >
          <div className="min-h-full px-8 md:px-12 py-10 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <Footer logoSrc={LOGO_SRC} setActiveSection={setActiveSection} />
      </div>
    </div>
  );
}
