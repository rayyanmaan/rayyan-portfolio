import { motion } from 'framer-motion';

const sections = [
  {
    label: 'Languages',
    items: [
      { icon: '🐍', name: 'Python', cat: 'backend · ml' },
      { icon: '📘', name: 'TypeScript', cat: 'frontend · full-stack' },
      { icon: '☕', name: 'JavaScript', cat: 'web · node' },
      { icon: '🦀', name: 'Rust', cat: 'systems' },
    ],
  },
  {
    label: 'Frontend',
    items: [
      { icon: '⚛️', name: 'React', cat: 'ui library' },
      { icon: '▲', name: 'Next.js', cat: 'framework' },
      { icon: '🎨', name: 'Figma', cat: 'design' },
      { icon: '💨', name: 'Tailwind', cat: 'styling' },
    ],
  },
  {
    label: 'Backend & Infra',
    items: [
      { icon: '🐘', name: 'PostgreSQL', cat: 'database' },
      { icon: '☁️', name: 'AWS', cat: 'cloud' },
      { icon: '🐳', name: 'Docker', cat: 'containers' },
      { icon: '⚡', name: 'FastAPI', cat: 'api' },
    ],
  },
];

export default function Stack() {
  return (
    <div className="w-full">
      {sections.map((section, si) => (
        <div key={section.label} className={si > 0 ? 'mt-12' : ''}>
          <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-[#888] mb-4">
            {section.label}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {section.items.map((item, ii) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: si * 0.1 + ii * 0.06 }}
                className="bg-white border border-[#e5e3df] aspect-square flex flex-col items-center justify-center p-4 transition-colors hover:bg-[#fcfcfc] cursor-default"
              >
                <div className="text-[24px] mb-2 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">{item.icon}</div>
                <div className="text-[12px] font-medium text-[#1a1a1a]">{item.name}</div>
                <div className="text-[10px] text-[#888] mt-0.5 uppercase tracking-wide">{item.cat.split(' · ')[0]}</div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
