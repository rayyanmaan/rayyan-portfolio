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
        className="mb-4 inline-block cursor-pointer select-none"
      >
        <span
          className={`text-[32px] md:text-[42px] leading-tight tracking-[-0.02em] transition-colors duration-300 ${isHovered ? 'text-black font-["Courier_New"]' : 'text-[#888]'}`}
        >
          {isHovered ? 'ریّان مان' : 'rayyan maan'}
        </span>
      </motion.div>

      <motion.p
        variants={item}
        className="text-[16px] leading-[1.6] text-[#555] max-w-[480px] font-normal"
      >
        Building products at the intersection of design & technology.<br />
        Curious about systems, aesthetics, & the space between ideas & reality.
      </motion.p>
    </motion.div>
  );
}
