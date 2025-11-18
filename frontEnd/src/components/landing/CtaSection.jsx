import { motion } from 'framer-motion';

// --- Animation Variants ---

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
      staggerChildren: 0.2, // Stagger animation for title, description, and button
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function CTASection() {
  return (
    <motion.section
      className="py-24 px-4 sm:px-10 text-center text-white bg-slate-900 border-t border-b border-teal-400/20" // Darker BG with border accents
      variants={sectionVariants}
      initial="hidden"
      whileInView="show" // Animate when section scrolls into view
      viewport={{ once: true, amount: 0.4 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Animated Title */}
        <motion.h3
          className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight"
          variants={itemVariants}
        >
          Ready to Transform Your <span className="text-teal-400">HR Strategy</span>?
        </motion.h3>

        {/* Animated Description */}
        <motion.p
          className="text-slate-300 text-xl mb-12 max-w-3xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Stop reacting to turnover. Use **AttriSense's** AI-powered insights to predict churn, improve retention, and build a stronger, more engaged workforce.
        </motion.p>

        {/* Animated Premium CTA Button */}
        <motion.button
          className="relative px-12 py-5 rounded-lg hover:text-black hover:bg-white border-2 border-white cursor-pointer
                     text-white text-xl font-bold shadow-2xl shadow-teal-500/40 
                     transition-all duration-300"
          variants={itemVariants}
          whileHover={{ scale: 1.05,  }} // Increased shadow for strong glow
          whileTap={{ scale: 0.98 }}
        >
          Get Started Today
        </motion.button>
      </div>
    </motion.section>
  );
}