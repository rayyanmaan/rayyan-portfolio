import { motion } from 'framer-motion';

const socials = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'X',
    href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.743l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Sparkle',
    href: '#',
    icon: <span className="text-[18px] leading-none">✦</span>,
  },
];

export default function Contact() {
  return (
    <div className="w-full flex flex-col justify-center min-h-[55vh]">
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-[clamp(38px,5.5vw,68px)] leading-[1.05] tracking-[-0.025em] mb-5"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        Let's build<br />something good.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-[17px] text-[#888] mb-10"
      >
        Reach me at{' '}
        <a
          href="mailto:maan@uni.minerva.edu"
          className="text-[#1a1a1a] border-b border-[#1a1a1a] pb-px transition-colors hover:text-[#c0392b] hover:border-[#c0392b]"
        >
          maan@uni.minerva.edu
        </a>
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex gap-3"
      >
        {socials.map((s) => (
          <motion.a
            key={s.label}
            href={s.href}
            title={s.label}
            whileHover={{ y: -3, boxShadow: '0 6px 16px rgba(0,0,0,0.08)' }}
            className="w-11 h-11 rounded-[12px] border border-[#e5e3df] bg-white flex items-center justify-center text-[#888] transition-colors hover:text-[#1a1a1a]"
          >
            {s.icon}
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
