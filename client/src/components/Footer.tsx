import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

interface FooterProps {
  logoSrc: string;
  setActiveSection: (s: string) => void;
}

export default function Footer({ logoSrc, setActiveSection }: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-[#f8f7f4] border-t border-[#e5e3df] z-50 flex items-center px-8 md:px-12">
      <div className="w-full flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => setActiveSection('me')}
          className="flex items-center gap-3 text-[13px] font-medium text-[#1a1a1a] cursor-pointer"
        >
          <div className="w-[24px] h-[24px] overflow-hidden flex-shrink-0">
            <img src={logoSrc} alt="logo" className="w-full h-full object-cover" />
          </div>
          rayyan maan
        </button>

        {/* Right - Contact / Socials */}
        <div className="flex items-center gap-6">
          <span className="hidden md:inline text-[12px] text-[#888] font-normal tracking-tight uppercase">let's work together</span>

          <div className="flex items-center gap-5">
            <a
              href="mailto:maan@uni.minerva.edu"
              className="text-[#888] hover:text-[#1a1a1a] transition-colors duration-200"
              aria-label="Email"
            >
              <Mail size={16} strokeWidth={1.5} />
            </a>
            <a
              href="https://github.com/rayyanmaan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#888] hover:text-[#1a1a1a] transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github size={16} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.linkedin.com/in/rayyan-maan-9a54a9211/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#888] hover:text-[#1a1a1a] transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.instagram.com/rayyan.minervauni/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#888] hover:text-[#1a1a1a] transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram size={16} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
