import { motion } from 'framer-motion';
import { useState } from 'react';

interface Project {
  id: number;
  title: string;
  image: string;
  link: string;
}

export default function Projects() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const projects: Project[] = [
    {
      id: 1,
      title: 'SwapCircle',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663060127024/Gp6siRUiHXvoPt4FNBXxxf/hero-gradient-1-5n6no8TtmUKFtr5ZdWZTNq.webp',
      link: '#',
    },
    {
      id: 2,
      title: 'StudySpot Finder',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663060127024/Gp6siRUiHXvoPt4FNBXxxf/abstract-pattern-WeEs79QWhC5yvvoQF9swGy.webp',
      link: '#',
    },
    {
      id: 3,
      title: 'Bayesian Sports Attendance Modeling',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663060127024/Gp6siRUiHXvoPt4FNBXxxf/project-card-bg-kC4cRhfMKcCwBdDFZRHFpm.webp',
      link: '#',
    },
  ];

  const experiences = [
    'Nippon Foundation',
    'GIDE LATAM & UTDT',
    'Microsoft',
    'CoBALT',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: '-100px' }}
      className="max-w-4xl mx-auto space-y-16"
    >
      <div className="space-y-8">
        <h2 className="text-3xl font-semibold text-foreground">Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-100 h-64 md:h-72">
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  animate={{ scale: hoveredId === project.id ? 1.05 : 1 }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <div className="relative h-12 overflow-hidden mt-4">
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: hoveredId === project.id ? -48 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-12"
                >
                  <div className="h-12 flex items-center">
                    <p className="text-sm text-gray-500">Project</p>
                  </div>
                  <div className="h-12 flex items-center">
                    <p className="text-sm font-medium text-foreground">{project.title}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-semibold text-foreground">Experience</h2>

        <ul className="space-y-4">
          {experiences.map((exp, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="text-sm text-gray-700"
            >
              {exp}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
