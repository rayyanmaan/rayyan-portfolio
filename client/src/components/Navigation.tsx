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
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-center pointer-events-none">
      <div className="flex gap-8 pointer-events-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`text-sm tracking-tight transition-colors duration-200 cursor-pointer ${activeSection === item.id
                ? 'text-[#1a1a1a] font-medium'
                : 'text-[#888] hover:text-[#1a1a1a]'
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
