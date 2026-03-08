import { motion } from 'framer-motion';
import { useState } from 'react';

const builds = [
  { id: 1, title: 'AI Tool', subtitle: 'LLM experiments', gradient: 'from-[#1a1a2e] to-[#16213e]', emoji: '🤖', dark: true, live: true },
  { id: 2, title: 'CLI App', subtitle: 'Developer tooling', gradient: 'from-[#0d1117] to-[#161b22]', emoji: '⌨️', dark: true },
  { id: 3, title: 'API Project', subtitle: 'Backend systems', gradient: 'from-[#1e3a5f] to-[#0e2439]', emoji: '📡', dark: true },
  { id: 4, title: 'ML Experiment', subtitle: 'Data & models', gradient: 'from-[#2d1b69] to-[#11047a]', emoji: '🧠', dark: true },
  { id: 5, title: 'Web App', subtitle: 'Full-stack build', gradient: 'from-[#064e3b] to-[#022c22]', emoji: '🌐', dark: true },
  { id: 6, title: 'Side Project', subtitle: 'In progress', gradient: 'from-[#292524] to-[#1c1917]', emoji: '🔧', dark: true, live: true },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Builds() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="w-full">
      <h2
        className="text-[32px] tracking-[-0.02em] mb-6"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        Builds
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
        {builds.map((build, i) => (
          <motion.div
            key={build.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            onHoverStart={() => setHovered(build.id)}
            onHoverEnd={() => setHovered(null)}
            whileHover={{ y: -7, scale: 1.015 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative rounded-[22px] overflow-hidden border border-[#2a2a2a] cursor-pointer"
            style={{ aspectRatio: '4/3' }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${build.gradient}`} />
            <div className="absolute inset-0 flex items-center justify-center text-[44px]">
              {build.emoji}
            </div>
            <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 bg-white/12 backdrop-blur-md rounded-full px-3.5 py-1.5 text-xs font-medium text-white">
              {build.live && <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] flex-shrink-0" />}
              {build.title}
            </div>
            <div className="absolute bottom-3.5 right-3.5 bg-white/10 backdrop-blur-md rounded-[10px] px-2.5 py-1.5 text-[11px] text-white/60 max-w-[140px] leading-snug">
              {build.subtitle}
            </div>
            <motion.div
              className="absolute inset-0 bg-white/5"
              animate={{ opacity: hovered === build.id ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
