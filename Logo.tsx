import { motion } from 'framer-motion';

interface LogoProps {
  onClick: () => void;
  src: string;
}

export default function Logo({ onClick, src }: LogoProps) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        rotate: -8,
        scale: 1.14,
        y: -3,
        transition: { type: 'spring', stiffness: 400, damping: 10 },
      }}
      className="fixed top-5 left-5 z-[60] w-9 h-9 rounded-[7px] overflow-hidden cursor-pointer shadow-md"
      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.14)' }}
    >
      <img src={src} alt="Rayyan seal" className="w-full h-full object-cover" />
    </motion.div>
  );
}
