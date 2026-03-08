import { motion } from 'framer-motion';

export default function About() {
  const sections = [
    {
      title: 'Hi!',
      content: 'I\'m rayyan maan, a designer and developer passionate about creating thoughtful products that bring people together. I believe in the power of design to make life more intuitive and beautiful.',
    },
    {
      title: 'Experience',
      content: 'Nippon Foundation, GIDE LATAM & UTDT, Microsoft, CoBALT',
    },
    {
      title: 'Community',
      content: 'Google Developers Group (GDG) Minerva, AI & Tech Society, Edgur',
    },
    {
      title: 'Philosophy',
      content: 'I believe thoughtful design makes life more intuitive. I want to bring more of it into the world—whether through my creations or the communities I\'m helping to build.',
    },
    {
      title: 'Shelf',
      content: 'Currently exploring: design systems, AI-driven products, and the intersection of culture and technology.',
    },
    {
      title: 'Lore',
      content: 'When I\'m not designing or coding, you\'ll find me discovering new hidden spots, getting excited about beautifully designed things, or listening to audiobooks on long drives.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: '-100px' }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <div className="space-y-6 mb-12">
        <h2 className="text-3xl font-semibold text-foreground">About</h2>
        <p className="text-base text-gray-700 leading-relaxed max-w-2xl">
          I'm passionate about creating products at the intersection of design, technology, and human connection. 
          I believe in thoughtful design that makes life more intuitive and beautiful.
        </p>
      </div>

      <div className="space-y-12">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              {section.title}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
