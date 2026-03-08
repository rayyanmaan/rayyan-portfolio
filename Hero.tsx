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
        className="text-[clamp(54px,8vw,92px)] leading-[0.97] tracking-[-0.03em] mb-7"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        rayyan<br />
        <em className="text-[#888] not-italic" style={{ fontStyle: 'italic' }}>maan.</em>
      </motion.h1>

      <motion.p
        variants={item}
        className="text-[17px] leading-[1.72] text-[#555] max-w-[500px] mb-8 font-light"
      >
        Building products at the intersection of design and technology.
        Curious about systems, aesthetics, and the space between ideas and reality.
      </motion.p>

      <motion.div variants={item} className="flex gap-2 flex-wrap">
        {['Product Design', 'Software Engineering', 'Minerva University', 'Currently building'].map((tag) => (
          <span
            key={tag}
            className="px-[15px] py-[6px] border border-[#e5e3df] rounded-full text-xs text-[#888] bg-white"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
