import { motion } from 'framer-motion';

const sections = [
  {
    label: 'Languages',
    items: [
      { icon: '🐍', name: 'Python', cat: 'backend & ml' },
      { icon: '📘', name: 'TypeScript', cat: 'frontend & full-stack' },
      { icon: '☕', name: 'JavaScript', cat: 'web & node' },
      { icon: '🦀', name: 'Rust', cat: 'systems' },
      { icon: '🐹', name: 'Go', cat: 'cloud & infra' },
      { icon: 'cpp', name: 'C++', cat: 'performant' },
      { icon: '💎', name: 'Ruby', cat: 'web apps' },
      { icon: '🐘', name: 'PHP', cat: 'legacy & modern' },
    ],
  },
  {
    label: 'Frontend',
    items: [
      { icon: '⚛️', name: 'React', cat: 'ui library' },
      { icon: '▲', name: 'Next.js', cat: 'framework' },
      { icon: '🎨', name: 'Figma', cat: 'interface design' },
      { icon: '💨', name: 'Tailwind', cat: 'styling & layout' },
      { icon: '🟠', name: 'Svelte', cat: 'reactive ui' },
      { icon: '📽️', name: 'Framer', cat: 'micro-interactions' },
      { icon: '🟢', name: 'Vue.js', cat: 'frontend framework' },
      { icon: '🌀', name: 'GSAP', cat: 'web animation' },
    ],
  },
  {
    label: 'Backend & Infrastructure',
    items: [
      { icon: '🐘', name: 'PostgreSQL', cat: 'relational db' },
      { icon: '🚀', name: 'Redis', cat: 'caching & queues' },
      { icon: '🐳', name: 'Docker', cat: 'containment' },
      { icon: '☸️', name: 'Kubernetes', cat: 'orchestration' },
      { icon: '☁️', name: 'AWS', cat: 'cloud computes' },
      { icon: '📡', name: 'GraphQL', cat: 'data querying' },
      { icon: '🏗️', name: 'Terraform', cat: 'iac' },
      { icon: '🔌', name: 'FastAPI', cat: 'python server' },
      { icon: '🍃', name: 'MongoDB', cat: 'document db' },
      { icon: '⚡', name: 'Serverless', cat: 'lambda functions' },
    ],
  },
  {
    label: 'Creative & Others',
    items: [
      { icon: '🎬', name: 'Adobe CC', cat: 'visual & motion' },
      { icon: '🧊', name: 'Spline', cat: '3d design' },
      { icon: '🍩', name: 'Blender', cat: '3d modeling' },
      { icon: '💳', name: 'Stripe', cat: 'payments' },
      { icon: '🔐', name: 'Clerk', cat: 'authentication' },
      { icon: '🔥', name: 'Firebase', cat: 'real-time & auth' },
      { icon: '💾', name: 'Supabase', cat: 'open-source db' },
      { icon: '🛠️', name: 'Vercel', cat: 'deployment & ci' },
    ],
  },
];

export default function Stack() {
  return (
    <div className="w-full pb-20">
      {sections.map((section, si) => (
        <div key={section.label} className={si > 0 ? 'mt-16' : ''}>
          <p className="text-[9px] uppercase tracking-[0.22em] font-bold text-[#aaa] mb-6">
            {section.label}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1.5">
            {section.items.map((item, ii) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: si * 0.12 + ii * 0.05 }}
                className="bg-white border border-[#ececec] aspect-square flex flex-col items-center justify-center p-4 transition-all duration-300 hover:bg-[#fafafa] hover:border-[#1a1a1a] cursor-default group"
              >
                <div className="text-[20px] mb-2 transition-transform duration-300 group-hover:scale-125 filter group-hover:drop-shadow-sm">
                  {item.icon === 'cpp' ? <span className="text-[14px] font-bold">C++</span> : item.icon}
                </div>
                <div className="text-[11px] font-medium text-[#1a1a1a] text-center leading-tight">{item.name}</div>
                <div className="text-[8px] text-[#bbb] mt-1 uppercase tracking-widest text-center whitespace-nowrap">{item.cat}</div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
