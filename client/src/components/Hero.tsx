import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-2xl"
    >
      <motion.div
        variants={item}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="mb-6 inline-block cursor-pointer select-none group"
      >
        <div className="relative overflow-hidden h-[42px] md:h-[52px]">
          <AnimatePresence mode="wait">
            {!isHovered ? (
              <motion.span
                key="english"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                className="text-[32px] md:text-[42px] leading-tight tracking-[-0.02em] text-foreground font-medium block"
              >
                rayyan maan
              </motion.span>
            ) : (
              <motion.span
                key="urdu"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className='text-[32px] md:text-[42px] leading-tight tracking-[-0.02em] text-[#888] font-["Courier_New"] block'
                dir="rtl"
              >
                ریّان مان
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.p
        variants={item}
        className={`text-[16px] leading-[1.6] max-w-[480px] font-normal transition-colors duration-500 ${isHovered ? 'text-foreground' : 'text-[#888]'}`}
      >
        Building products at the intersection of design & technology.<br />
        Curious about systems, aesthetics, & the space between ideas & reality.
      </motion.p>
    </motion.div>
  );
}
