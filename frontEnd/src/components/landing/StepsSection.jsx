import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// --- Animation Variants ---

// Variant for the main heading
const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Variant for the steps container (to stagger children)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Delay between each step's animation
    },
  },
};

// Variant for individual step cards
const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export function StepsSection() {
  const steps = [
    {
      title: '1. Upload Dataset',
      description: 'Import your HR CSV file securely. The system automatically handles data cleaning, validation, and feature engineering.',
      icon: '',
    },
    {
      title: '2. Model Analysis',
      description: 'Our proprietary multi-level stacking models analyze complex attrition patterns using your custom, validated dataset.',
      icon: '',
    },
    {
      title: '3. View Predictions',
      description: 'Instantly access employee risk scores, critical risk factors, and actionable retention recommendations in the dashboard.',
      icon: '',
    },
  ];

  return (
    <motion.section
      className="py-24 px-4 sm:px-10 text-white bg-[#0b1120] relative overflow-hidden" // Added relative and overflow
    >
      <div className="max-w-7xl mx-auto">
        {/* Animated Heading */}
        <motion.h3
          className="text-4xl font-extrabold mb-16 text-center tracking-tight"
          variants={headingVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
        >
          How <span className="text-teal-400">AttriSense</span> Works
        </motion.h3>

        {/* Steps Grid Container */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Flow Lines (Only visible on medium screens and up) */}
          <div className="hidden md:block absolute top-1/4 left-1/2 w-1/2 -translate-x-1/2 h-1 pointer-events-none">
            {/* Horizontal Line */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/20"></div>

            {/* Arrows/Markers */}
            <ArrowRight className="absolute left-[33.33%] top-1/2 -translate-y-1/2 text-teal-400 w-8 h-8 z-10 p-1 bg-[#0b1120]" />
            <ArrowRight className="absolute left-[66.66%] top-1/2 -translate-y-1/2 text-teal-400 w-8 h-8 z-10 p-1 bg-[#0b1120]" />
          </div>

          {/* Map Steps */}
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="p-8 bg-white/5 border border-white/10 rounded-xl shadow-lg hover:border-teal-400 transition duration-300 relative z-20" // Increased padding and added hover border
              variants={itemVariants}
            >
              <div className="text-4xl mb-4 text-teal-300">{step.icon}</div>
              <h4 className="text-xl font-bold mb-3">{step.title}</h4>
              <p className="text-slate-300 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}