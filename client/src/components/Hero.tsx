import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Globe from './Globe';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

interface HeroProps {
  isDark: boolean;
  scrollRef: React.RefObject<HTMLElement | null>;
}

export default function Hero({ isDark, scrollRef }: HeroProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Track scroll on the fixed main container, not on window/body.
  const { scrollY } = useScroll({ container: scrollRef });

  // Grow the globe as the user scrolls down.
  const globeScale = useTransform(scrollY, [0, 350, 950], [0.88, 1.02, 1.18]);

  // Smoothly shift the globe upward into center as user scrolls.
  // Starts slightly below headline, transitions to centered.
  const globeY = useTransform(scrollY, [0, 600], [0, -40]);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Top: Name & Bio */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[600px] text-center mt-[6vh] mb-[1vh] z-10"
      >
        <motion.div
          variants={item}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="mb-6 inline-block cursor-pointer select-none group relative pointer-events-auto"
        >
          <div className="relative h-[48px] md:h-[58px] w-full flex items-center justify-center z-10">
            <AnimatePresence mode="wait">
              {!isHovered ? (
                <motion.span
                  key="english"
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 40, opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[clamp(32px,4.5vw,44px)] leading-tight text-foreground font-medium block whitespace-nowrap"
                  style={{ letterSpacing: '-0.06em', fontFamily: '"League Spartan", sans-serif' }}
                >
                  rayyan maan
                </motion.span>
              ) : (
                <motion.span
                  key="urdu"
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[clamp(34px,5vw,48px)] leading-tight tracking-[-0.02em] text-foreground block"
                  style={{ fontFamily: '"AA Sameer Qamri", serif', direction: 'rtl' }}
                >
                  ریّان مان
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.p
          variants={item}
          className={`text-[clamp(14px,1.5vw,16px)] leading-[1.6] font-normal transition-colors duration-700 ${isHovered ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          Data science, product thinking, and software engineering.<br />
          From user interviews to ML pipelines to shipped products  -  across 7 cities.
        </motion.p>
      </motion.div>

      {/* Globe Section  -  starts close to headline, scrolls into center */}
      <div className="w-full relative h-[160vh] pointer-events-auto mt-0">
        <div className="sticky top-[4vh] flex flex-col items-center justify-start w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 0.88 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[1300px] flex justify-center items-center px-4 md:px-0"
            style={{ scale: globeScale, y: globeY }}
          >
            <Globe isDark={isDark} scrollProgress={scrollY} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
