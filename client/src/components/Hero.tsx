import { motion } from 'framer-motion';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-5xl md:text-6xl font-semibold text-foreground leading-tight">
          rayyan maan
        </h1>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-lg text-gray-600 font-light leading-relaxed max-w-xl"
      >
        Building products at the intersection of design and technology.
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex gap-6 pt-4"
      >
        <motion.a
          href="#work"
          whileHover={{ y: -2 }}
          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          Work
        </motion.a>
        <motion.a
          href="#about"
          whileHover={{ y: -2 }}
          className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors"
        >
          About
        </motion.a>
      </motion.div>
    </motion.div>
  );
}
