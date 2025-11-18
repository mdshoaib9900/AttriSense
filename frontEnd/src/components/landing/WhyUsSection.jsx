import { motion } from 'framer-motion';

// 1. Define the animation variants for the whole container (staggering the children)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay between each card's animation
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// 3. Define a simple animation for the main heading
const headingVariants = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

export function WhyUsSection() {
  // Data for the cards to make the component cleaner
  const features = [
    {
      title: 'Enterprise-Grade Accuracy',
      description: 'Built using advanced multi-level stacking models to achieve market-leading prediction precision.',
      icon: '', // Added a simple emoji icon
    },
    {
      title: 'Role-Based Access',
      description: 'Strict security protocols ensure only authorized HR and management can log in — secure and compliant.',
      icon: '',
    },
    {
      title: 'Real, Actionable Insights',
      description: 'Go beyond predictions — receive full-suite analytics and practical, data-driven recommendations.',
      icon: '',
    },
  ];

  return (
    // Use motion.section for the main container to manage scroll-based animation
    <section className="py-24 px-4 sm:px-10 text-white bg-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Animated Heading */}
        <motion.h3
          className="text-4xl font-extrabold mb-16 text-center tracking-tight"
          variants={headingVariants}
          initial="hidden"
          whileInView="show" // Animate when the element enters the viewport
          viewport={{ once: true, amount: 0.5 }}
        >
          Why Choose <span className="text-teal-400">AttriSense</span>?
        </motion.h3>

        {/* Animated Card Grid Container */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show" // Animate when the grid enters the viewport
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 bg-white/5 border border-white/10 rounded-2xl shadow-2xl hover:bg-white/10 transition duration-300"
              variants={cardVariants} // Apply the individual card animation
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-2xl font-bold mb-3 text-teal-300">
                {feature.title}
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}