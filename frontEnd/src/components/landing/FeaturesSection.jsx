import { motion } from 'framer-motion';
// Example icons from a library like lucide-react (you may need to install it)
import { Brain, Database, Monitor } from 'lucide-react';

// --- Animation Variants ---

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
};

export function FeaturesSection() {
  const features = [
    {
      title: 'AI Prediction Core',
      description: 'Leverage proprietary multi-level stacking models to accurately forecast employee churn probability with industry-leading precision.',
      icon: <Brain className="text-teal-400 w-6 h-6" />,
      style: 'md:col-span-1', // Half width
    },
    {
      title: 'Custom Dataset Integration',
      description: 'Securely upload and analyze your company\'s unique, historical employee data to train a model tailored specifically to your organization.',
      icon: <Database className="text-teal-400 w-6 h-6" />,
      style: 'md:col-span-1', // Half width
    },
    {
      title: 'Real-time Interactive Dashboard',
      description: 'Access dynamic insights, drill-down visualizations, and employee risk scores in a single, responsive dashboard updated in real time for proactive HR decision-making.',
      icon: <Monitor className="text-teal-400 w-6 h-6" />,
      style: 'md:col-span-2', // Full width
    },
  ];

  return (
    <motion.section 
      className="py-24 px-4 sm:px-10 text-white bg-slate-900"
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
          Powerful <span className="text-teal-400">HR Analytics</span>
        </motion.h3>

        {/* Feature Grid Container */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6" // Changed to md:grid-cols-2
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`p-8 bg-white/5 rounded-2xl shadow-xl transition-all duration-300 relative group
                         ${feature.style} border border-white/10 hover:border-teal-400`}
              variants={itemVariants}
            >
              <div className="flex items-center mb-3">
                <div className="p-2 mr-3 bg-teal-400/10 rounded-full border border-teal-400/20">
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-bold">
                  {feature.title}
                </h4>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {feature.description}
              </p>

              {/* Gradient border effect on hover for the full-width card */}
              {feature.style === 'md:col-span-2' && (
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
                  <div className="h-full w-full rounded-2xl bg-gradient-to-r from-teal-500/30 to-blue-500/30 blur-sm"></div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}