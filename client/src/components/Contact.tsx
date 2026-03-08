import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: '-100px' }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <h2 className="text-3xl font-semibold text-foreground">Contact</h2>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Interested in working together or want to chat? Feel free to reach out.
        </p>
        <motion.a
          href="mailto:hello@rayyanmaan.com"
          whileHover={{ x: 4 }}
          className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
        >
          hello@rayyanmaan.com
          <span>→</span>
        </motion.a>
      </div>
    </motion.div>
  );
}
