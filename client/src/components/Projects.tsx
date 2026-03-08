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
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="w-full">
      <h2
        className="text-[32px] tracking-[-0.02em] mb-6"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        Work
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            onHoverStart={() => setHovered(project.id)}
            onHoverEnd={() => setHovered(null)}
            whileHover={{ y: -7, scale: 1.015 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative rounded-[22px] overflow-hidden border border-[#e5e3df] bg-white cursor-pointer"
            style={{ aspectRatio: '4/3' }}
          >
            {/* Background */}
            {project.image ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${project.image})` }}
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
            )}

            {/* Emoji center */}
            {!project.image && (
              <div className="absolute inset-0 flex items-center justify-center text-[44px]">
                {project.emoji}
              </div>
            )}

            {/* Badge bottom-left */}
            <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 bg-white/92 backdrop-blur-md rounded-full px-3.5 py-1.5 text-xs font-medium text-[#1a1a1a]">
              {project.live && <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] flex-shrink-0" />}
              {project.title}{project.year && <span className="text-[#888]">• {project.year}</span>}
            </div>

            {/* Description bottom-right */}
            <div className="absolute bottom-3.5 right-3.5 bg-white/82 backdrop-blur-md rounded-[10px] px-2.5 py-1.5 text-[11px] text-[#888] max-w-[140px] leading-snug">
              {project.subtitle}
            </div>

            {/* Hover overlay */}
            <motion.div
              className="absolute inset-0 bg-black/5"
              animate={{ opacity: hovered === project.id ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
