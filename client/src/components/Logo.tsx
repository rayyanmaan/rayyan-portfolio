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
      whileHover={{
        scale: 1.05,
      }}
      className="fixed top-5 left-5 z-[60] w-9 h-9 overflow-hidden cursor-pointer group"
    >
      <motion.img
        src={src}
        alt="Rayyan seal"
        className="w-full h-full object-cover transition-all duration-500 ease-in-out"
        style={{ filter: 'invert(0)' }}
        whileHover={{ filter: 'invert(1)' }}
      />
    </motion.div>
  );
}
