import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <motion.div
      className="max-w-3xl" // Slightly wider container
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Primary Heading with Sequential Animation and Shine */}
      <motion.h2
        className="relative text-7xl lg:text-7xl font-extrabold leading-tight text-white mb-8 overflow-hidden" // Made text bolder
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <span className="relative inline-block">
          Predict Employee Attrition with
          {/* Shine effect 1 */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-150%] animate-shine"></span>
        </span>

        <span className="relative text-teal-400 block mt-2 overflow-hidden"> {/* Changed color to teal for consistency */}
          AI-driven Insights
          {/* Shine effect 2 */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-150%] animate-shine"></span>
        </span>
      </motion.h2>

      {/* Description Paragraph */}
      <motion.p
        className="text-slate-300 text-xl lg:text-2xl mb-12 leading-relaxed max-w-xl" // Increased margin and reduced line length
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        An intelligent HR analytics platform designed to analyze workforce
        patterns and accurately predict employee churn, empowering proactive
        retention strategies.
      </motion.p>

      {/* Premium CTA Button */}
      <motion.button
        className="relative px-10 py-4 rounded-xl font-semibold text-xl overflow-hidden
                     text-white
                   shadow-xl shadow-teal-500/30 transition-all duration-300
                   border-2 border-white cursor-pointer hover:bg-white hover:text-red-800" // Added a gradient and glow shadow
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(52, 211, 163, 0.7)' }} // Custom boxShadow for a better glow
        whileTap={{ scale: 0.98 }}
      >
        {/* Subtle inner border effect for depth */}
        <span className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none "></span>
        Get Started
      </motion.button>
    </motion.div>
  );
}