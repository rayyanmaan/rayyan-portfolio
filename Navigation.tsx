import { motion } from 'framer-motion';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const navItems = [
  { id: 'me', label: 'Me!' },
  { id: 'work', label: 'Work' },
  { id: 'builds', label: 'Builds' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
];

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center h-16 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex gap-0.5 bg-white/88 backdrop-blur-md border border-[#e5e3df] rounded-full px-1.5 py-1.5 shadow-sm pointer-events-auto"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`px-5 py-1.5 rounded-full text-[13.5px] transition-all duration-200 font-sans tracking-wide cursor-pointer ${
              activeSection === item.id
                ? 'bg-[#1a1a1a] text-white font-medium'
                : 'text-[#888] hover:text-[#1a1a1a]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </motion.div>
    </nav>
  );
}
