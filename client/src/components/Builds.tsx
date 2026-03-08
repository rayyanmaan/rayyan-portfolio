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
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-4">
        {builds.map((build, i) => (
          <motion.div
            key={build.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="group cursor-pointer"
          >
            {/* Box container - square aspect ratio, sharp edges */}
            <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
              <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 opacity-80 group-hover:opacity-100 ${build.gradient}`} />
              <div className="absolute inset-0 flex items-center justify-center text-[44px]">
                {build.emoji}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Label below the box */}
            <div className="mt-2.5 flex flex-col">
              <span className="text-[11px] uppercase tracking-wider font-medium text-[#1a1a1a]">
                {build.title}
              </span>
              <span className="text-[10.5px] text-[#888] font-normal uppercase tracking-wider mt-0.5">
                {build.subtitle}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
