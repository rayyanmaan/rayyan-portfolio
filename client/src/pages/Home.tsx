import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Logo from '@/components/Logo';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Builds from '@/components/Builds';
import Stack from '@/components/Stack';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import { LOGO_SRC } from '@/logoData';
import { useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function Home() {
  const [activeSection, setActiveSection] = useState('me');
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Restore section when navigating back from a project page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');
    if (from === 'work' || from === 'builds') {
      setActiveSection(from);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const scrollRef = useRef<HTMLElement>(null);

  const handleToggleTheme = () => {
    if (toggleTheme) toggleTheme();
  };

  const renderPage = () => {
    switch (activeSection) {
      case 'me': return <Hero isDark={isDark} scrollRef={scrollRef} />;
      case 'work': return <Projects />;
      case 'builds': return <Builds />;
      case 'stack': return <Stack />;
      case 'contact': return <Contact />;
      default: return <Hero isDark={isDark} scrollRef={scrollRef} />;
    }
  };

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen bg-background text-foreground transition-colors duration-500`}>
      <CustomCursor isDark={isDark} />
      {/* Scrollable main area */}
      <main ref={scrollRef} className="fixed inset-0 overflow-y-auto bg-background transition-colors duration-500" style={{ paddingBottom: 56 }}>
        <div className="min-h-full px-8 md:px-12 py-8 w-full relative">
          {/* Header row: Logo left, Nav center */}
          <div className="flex items-center justify-center mb-12 relative min-h-[48px]">
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <Logo
                onClick={handleToggleTheme}
                src={LOGO_SRC}
                isDark={isDark}
              />
            </div>
            <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
          </div>

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

      {/* Footer stays fixed at bottom */}
      <Footer logoSrc={LOGO_SRC} setActiveSection={setActiveSection} />
    </div>
  );
}
