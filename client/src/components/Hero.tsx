import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-2xl"
    >
      <motion.h1
        variants={item}
        className="text-[32px] md:text-[42px] leading-tight tracking-[-0.02em] mb-4 text-[#888]"
      >
        rayyan maan.
      </motion.h1>

      <motion.p
        variants={item}
        className="text-[16px] leading-[1.6] text-[#555] max-w-[480px] font-normal"
      >
        Building products at the intersection of design and technology.
        Curious about systems, aesthetics, and the space between ideas and reality.
      </motion.p>
    </motion.div>
  );
}
