interface FooterProps {
  logoSrc: string;
  setActiveSection: (s: string) => void;
}

const navItems = [
  { id: 'me', label: 'Me!' },
  { id: 'work', label: 'Work' },
  { id: 'builds', label: 'Builds' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
];

export default function Footer({ logoSrc, setActiveSection }: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-[#f8f7f4] border-t border-[#e5e3df] z-50 flex items-center px-[72px]">
      <div className="w-full max-w-[1240px] mx-auto flex items-center justify-between gap-5">
        {/* Brand */}
        <button
          onClick={() => setActiveSection('me')}
          className="flex items-center gap-2.5 text-[14px] font-medium text-[#1a1a1a] cursor-pointer"
        >
          <div className="w-[26px] h-[26px] rounded-[5px] overflow-hidden shadow-sm flex-shrink-0">
            <img src={logoSrc} alt="seal" className="w-full h-full object-cover" />
          </div>
          rayyan maan
        </button>

        {/* Nav */}
        <nav className="flex gap-[22px]">
          {navItems.map((n) => (
            <button
              key={n.id}
              onClick={() => setActiveSection(n.id)}
              className="text-[13px] text-[#888] hover:text-[#1a1a1a] transition-colors cursor-pointer"
            >
              {n.label}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
          <span className="text-[13px] text-[#888]">Let's work together!</span>
          <a
            href="mailto:maan@uni.minerva.edu"
            className="text-[13px] font-medium text-[#1a1a1a] border-b border-[#1a1a1a] no-underline"
          >
            maan@uni.minerva.edu
          </a>
          {/* Instagram */}
          <a href="#" className="text-[#bbb] hover:text-[#1a1a1a] transition-colors flex items-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          {/* X */}
          <a href="#" className="text-[#bbb] hover:text-[#1a1a1a] transition-colors flex items-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.743l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          {/* LinkedIn */}
          <a href="#" className="text-[#bbb] hover:text-[#1a1a1a] transition-colors flex items-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          {/* Sparkle */}
          <a href="#" className="text-[#bbb] hover:text-[#1a1a1a] transition-colors text-[17px] leading-none">✦</a>
        </div>
      </div>
    </footer>
  );
}
