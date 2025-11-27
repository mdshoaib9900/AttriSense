import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react'; 
import { useState } from 'react';
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};

// --- Features Data ---

const baseFeatures = [
  { text: 'Single Dataset Upload', included: true },
  { text: 'Basic Attrition Probability Score', included: true },
  { text: '1-Month Data History', included: true },
  { text: 'Role-Based Access Control', included: false },
  { text: 'Proactive Retention Recommendations', included: false },
  { text: 'Priority Email Support', included: false },
];

const proFeatures = [
  { text: 'Unlimited Dataset Uploads', included: true },
  { text: 'Advanced Attrition Modeling (90%+ Accuracy)', included: true },
  { text: 'Up to 5 Years Data History', included: true },
  { text: 'Role-Based Access Control', included: true },
  { text: 'Proactive Retention Recommendations', included: true },
  { text: 'Priority Email Support', included: false },
];

const enterpriseFeatures = [
  { text: 'Dedicated AWS Instance', included: true },
  { text: 'Custom ML Model Training', included: true },
  { text: 'Unlimited Data History & Storage', included: true },
  { text: 'Single Sign-On (SSO) Integration', included: true },
  { text: 'Proactive Retention Recommendations', included: true },
  { text: 'Dedicated Account Manager & 24/7 Support', included: true },
];

// --- Pricing Data ---

const plans = [
  {
    name: 'Basic',
    monthlyPrice: 99,
    annualPrice: 999, // ~15% discount
    description: 'Perfect for small teams and initial analysis.',
    features: baseFeatures,
    highlight: false,
  },
  {
    name: 'Pro',
    monthlyPrice: 299,
    annualPrice: 2999, // ~15% discount
    description: 'Essential for growing companies needing deeper insights.',
    features: proFeatures,
    highlight: true, // This is the recommended tier
  },
  {
    name: 'Enterprise',
    monthlyPrice: null, // Custom quote
    annualPrice: null,
    description: 'Tailored solutions for large organizations and custom requirements.',
    features: enterpriseFeatures,
    highlight: false,
  },
];

export function PricingSection() {
  const [isMonthly, setIsMonthly] = useState(true);

  // Function to render the feature list
  const renderFeatures = (features) => (
    <ul className="space-y-3 pt-4 border-t border-white/10">
      {features.map((feature, i) => (
        <li key={i} className={`flex items-start text-left text-sm ${feature.included ? 'text-slate-200' : 'text-slate-500'}`}>
          {feature.included ? (
            <Check className="w-5 h-5 text-teal-400 mr-2 flex-shrink-0" />
          ) : (
            <X className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
          )}
          {feature.text}
        </li>
      ))}
    </ul>
  );

  return (
    <motion.section
      className="py-24 px-4 sm:px-10 text-white bg-slate-900"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-center">
          Transparent <span className="text-teal-400">Pricing</span>
        </h2>
        <p className="text-slate-400 text-xl mb-12 text-center max-w-3xl mx-auto">
          Choose the plan that fits your team's size and analytical needs. No hidden fees.
        </p>

        {/* --- Monthly/Annual Toggle --- */}
        <div className="flex justify-center mb-16">
          <div className="p-1 rounded-full bg-white/10 flex space-x-2 relative">
            {/* Toggle Indicator */}
            <motion.div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-teal-500 rounded-full"
              initial={{ x: 0 }}
              animate={{ x: isMonthly ? '2px' : 'calc(100% + 2px)' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
            
            {/* Monthly Button */}
            <button
              onClick={() => setIsMonthly(true)}
              className={`px-6 py-2 rounded-full font-semibold relative z-10 transition duration-300 ${
                isMonthly ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            
            {/* Annual Button */}
            <button
              onClick={() => setIsMonthly(false)}
              className={`px-6 py-2 rounded-full font-semibold relative z-10 transition duration-300 ${
                !isMonthly ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Annually <span className="text-xs ml-1 bg-white/20 px-2 py-0.5 rounded-full">Save 15%</span>
            </button>
          </div>
        </div>

        {/* --- Pricing Cards Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`p-10 rounded-2xl shadow-2xl transition-all duration-300 relative
                ${
                  plan.highlight
                    ? 'bg-[#182033] border-2 border-teal-400 scale-[1.02]' // Highlighted tier styling
                    : 'bg-white/5 border border-white/10'
                }`}
              variants={cardVariants}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-teal-500 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold shadow-lg rotate-3">
                  Recommended
                </div>
              )}

              <h3 className="text-3xl font-bold mb-2 text-white">{plan.name}</h3>
              <p className="text-slate-400 mb-6">{plan.description}</p>

              {/* Price Display */}
              <div className="mb-8">
                {plan.monthlyPrice !== null ? (
                  <>
                    <p className="text-6xl font-extrabold text-white">
                      ₹{isMonthly ? plan.monthlyPrice : plan.annualPrice}
                    </p>
                    <p className="text-slate-400 mt-1">
                      {isMonthly ? 'per month' : 'per year (billed annually)'}
                    </p>
                  </>
                ) : (
                  <p className="text-4xl font-extrabold text-teal-400 py-3">
                    Contact Sales
                  </p>
                )}
              </div>
              
              {/* Feature List */}
              {renderFeatures(plan.features)}

              {/* CTA Button */}
              <motion.button
                className={`mt-10 w-full py-3 rounded-lg text-lg font-bold transition-all duration-300
                  ${
                    plan.highlight
                      ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/40'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.monthlyPrice !== null ? 'Start Free Trial' : 'Request Demo'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}