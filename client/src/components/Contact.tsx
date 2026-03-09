import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

export default function Contact() {
  const socials = [
    { icon: <Mail size={20} strokeWidth={1.5} />, href: 'mailto:maan@uni.minerva.edu', label: 'Email' },
    { icon: <Github size={20} strokeWidth={1.5} />, href: 'https://github.com/rayyanmaan', label: 'GitHub' },
    { icon: <Linkedin size={20} strokeWidth={1.5} />, href: 'https://www.linkedin.com/in/rayyan-maan-9a54a9211/', label: 'LinkedIn' },
    { icon: <Instagram size={20} strokeWidth={1.5} />, href: 'https://www.instagram.com/rayyan.minervauni/', label: 'Instagram' },
  ];

  return (
    <div className="w-full flex flex-col justify-center min-h-[60vh] py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-[42px] md:text-[64px] leading-[1.1] tracking-[-0.03em] mb-8 font-normal text-[#1a1a1a]">
          let's build & create<br />something together.
        </h2>

        <div className="flex flex-col gap-10">
          <p className="text-[16px] text-[#888] max-w-[440px] leading-relaxed">
            I'm always open to new ideas, collaborations, & interesting projects.
            Reach out if you'd like to work together or just say hello.
          </p>

          <div className="flex gap-4">
            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target={s.label !== 'Email' ? "_blank" : undefined}
                rel={s.label !== 'Email' ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -4 }}
                className="w-12 h-12 border border-[#e5e3df] bg-white flex items-center justify-center text-[#888] hover:text-[#1a1a1a] transition-colors"
                aria-label={s.label}
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
