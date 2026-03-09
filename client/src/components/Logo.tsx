import { motion } from 'framer-motion';

interface LogoProps {
  onClick: () => void;
  src: string;
  isDark: boolean;
}

export default function Logo({ onClick, src, isDark }: LogoProps) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-5 left-5 z-[60] w-9 h-9 cursor-pointer group bg-background transition-colors duration-500"
      style={{
        clipPath: 'inset(2px)', // Cuts off the black corners/lining
      }}
    >
      <motion.img
        src={src}
        alt="Rayyan seal"
        className="w-full h-full object-cover transition-all duration-500 ease-in-out"
        style={{
          filter: isDark ? 'invert(1)' : 'invert(0)',
        }}
        whileHover={{
          filter: isDark ? 'invert(0)' : 'invert(1)',
        }}
      />
    </motion.div>
  );
}
