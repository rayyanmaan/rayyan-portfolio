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
    <div className="w-full max-w-4xl">
      <h2
        className="text-[32px] tracking-[-0.02em] mb-8"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        Stack
      </h2>
      {sections.map((section, si) => (
        <div key={section.label} className={si > 0 ? 'mt-8' : ''}>
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#888] mb-3">
            {section.label}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {section.items.map((item, ii) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: si * 0.1 + ii * 0.06 }}
                whileHover={{ y: -4, boxShadow: '0 8px 20px rgba(0,0,0,0.07)' }}
                className="bg-white border border-[#e5e3df] rounded-[16px] p-5 text-center transition-shadow cursor-default"
              >
                <div className="text-[28px] mb-2">{item.icon}</div>
                <div className="text-[13px] font-medium text-[#1a1a1a]">{item.name}</div>
                <div className="text-[11px] text-[#888] mt-0.5">{item.cat}</div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
