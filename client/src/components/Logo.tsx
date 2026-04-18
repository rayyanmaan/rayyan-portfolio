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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="w-10 h-10 cursor-pointer"
    >
      <img
        src={src}
        alt="Rayyan seal"
        className="w-full h-full object-cover transition-all duration-500 ease-in-out"
        style={{
          filter: isDark
            ? 'invert(1) contrast(1.1)'
            : 'contrast(1.4) saturate(0)',
        }}
      />
    </motion.div>
  );
}
