import { motion } from 'framer-motion';
import { useState } from 'react';

interface Project {
  id: number;
  title: string;
  subtitle: string;
  image?: string;
  gradient: string;
  emoji: string;
  year?: string;
  live?: boolean;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'SwapCircle',
    subtitle: 'Product design & engineering',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663060127024/Gp6siRUiHXvoPt4FNBXxxf/hero-gradient-1-5n6no8TtmUKFtr5ZdWZTNq.webp',
    gradient: 'from-[#e8eaf6] to-[#c5cae9]',
    emoji: '🔄',
    year: '2024',
  },
  {
    id: 2,
    title: 'StudySpot Finder',
    subtitle: 'UX research & mobile',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663060127024/Gp6siRUiHXvoPt4FNBXxxf/abstract-pattern-WeEs79QWhC5yvvoQF9swGy.webp',
    gradient: 'from-[#e8f5e9] to-[#c8e6c9]',
    emoji: '📚',
    year: '2024',
  },
  {
    id: 3,
    title: 'Bayesian Sports Model',
    subtitle: 'Data science & research',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663060127024/Gp6siRUiHXvoPt4FNBXxxf/project-card-bg-kC4cRhfMKcCwBdDFZRHFpm.webp',
    gradient: 'from-[#fff3e0] to-[#ffe0b2]',
    emoji: '📊',
    year: '2023',
  },
  {
    id: 4,
    title: 'Design System',
    subtitle: 'Components & tokens',
    gradient: 'from-[#fce4ec] to-[#f8bbd0]',
    emoji: '🎨',
    year: '2024',
  },
  {
    id: 5,
    title: 'Microsoft Internship',
    subtitle: 'PM & product strategy',
    gradient: 'from-[#e3f2fd] to-[#bbdefb]',
    emoji: '🪟',
    year: '2023',
  },
  {
    id: 6,
    title: 'CoBALT',
    subtitle: 'Full-stack development',
    gradient: 'from-[#f3e5f5] to-[#e1bee7]',
    emoji: '✨',
    live: true,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Projects() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-4">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="group cursor-pointer"
          >
            {/* Box container - square aspect ratio, sharp edges */}
            <div className="relative aspect-square overflow-hidden bg-[#eee]">
              {/* Background */}
              {project.image ? (
                <motion.div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ${project.gradient}`} />
              )}

              {!project.image && (
                <div className="absolute inset-0 flex items-center justify-center text-[44px]">
                  {project.emoji}
                </div>
              )}

              {/* Minimal overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>

            {/* Label below the box */}
            <div className="mt-2.5 flex flex-col">
              <span className="text-[11px] uppercase tracking-wider font-medium text-[#1a1a1a]">
                {project.title}: {project.subtitle}
              </span>
              <span className="text-[10.5px] text-[#888] font-normal uppercase tracking-wider mt-0.5">
                {project.year || '2024'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
