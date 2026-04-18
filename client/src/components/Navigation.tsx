import { navItems } from '@/data/navigation';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  return (
    <nav className="flex items-center justify-center pointer-events-none">
      <div className="flex gap-4 sm:gap-6 md:gap-10 pointer-events-auto flex-wrap justify-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`text-sm tracking-tight transition-colors duration-200 cursor-pointer ${activeSection === item.id
              ? 'text-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground'
              }`}
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
