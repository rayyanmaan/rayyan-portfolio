import { Github, Linkedin, Instagram, Mail } from 'lucide-react';
import { navItems } from '@/data/navigation';

interface FooterProps {
  logoSrc: string;
  setActiveSection: (s: string) => void;
}

export default function Footer({ logoSrc, setActiveSection }: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-[60] bg-background border-t border-border transition-colors duration-500">
      <div className="max-w-[1440px] mx-auto px-5 h-14 flex items-center justify-between">
        {/* Left - Branding & Navigation */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveSection('me')}
            className="flex items-center gap-2.5 group transition-opacity hover:opacity-70"
          >
            <div className="w-5 h-5 overflow-hidden">
              <img
                src={logoSrc}
                alt="logo"
                className="w-full h-full object-cover transition-all duration-500"
                style={{ filter: 'var(--logo-filter, brightness(0) contrast(1.2))' }}
              />
            </div>
                  <span className="text-[13px] font-medium text-foreground tracking-tight" style={{ fontFamily: '"League Spartan", sans-serif' }}>rayyan maan</span>
          </button>

          <nav className="hidden lg:flex items-center gap-6 border-l border-border pl-8">
            {navItems.filter(item => item.id !== 'me').map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveSection(link.id)}
                className="text-[12px] text-muted-foreground hover:text-foreground transition-colors font-medium tracking-tight uppercase"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right - Contact / Socials */}
        <div className="flex items-center gap-6">
          <span className="hidden md:inline text-[12px] text-muted-foreground font-normal tracking-tight lowercase">let's work together!</span>

          <div className="flex items-center gap-5">
            <a
              href="mailto:maan@uni.minerva.edu"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Email"
            >
              <Mail size={16} strokeWidth={1.5} />
            </a>
            <a
              href="https://github.com/rayyanmaan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="GitHub"
            >
              <Github size={16} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.linkedin.com/in/rayyan-maan-9a54a9211/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={16} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.instagram.com/rayyan.minervauni/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Instagram"
            >
              <Instagram size={16} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
