import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu } from 'lucide-react'; // Icon for the mobile menu

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // Hook to handle the scroll event
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50; // Triggers after scrolling 50px
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <motion.nav
      className={`fixed top-0 z-50 w-full py-4 transition-all mb-[2rem] duration-300 ${
        scrolled
          ? "bg-[#0b1120]/90 backdrop-blur-md shadow-lg" // Darker, blurred background on scroll
          : "bg-transparent" // Transparent when at the top
      } flex items-center justify-between px-6 lg:px-14 text-white`}
      initial={{ opacity: 0, y: -50 }} // Increased initial y for a dramatic drop
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* 1. Logo/Branding */}
      <motion.h1
        className="text-3xl font-extrabold tracking-tight cursor-pointer"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <span className="text-teal-400">Attri</span>Sense
      </motion.h1>

      {/* 2. Desktop Navigation Links (Hidden on small screens) */}
      <motion.div
        className="hidden md:flex items-center gap-10 text-base font-medium text-slate-300"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <motion.a whileHover={{ scale: 1.05 }} className="hover:text-white transition duration-200 cursor-pointer">
          Features
        </motion.a>
        <motion.a whileHover={{ scale: 1.05 }} className="hover:text-white transition duration-200 cursor-pointer">
          Pricing
        </motion.a>
        <motion.a whileHover={{ scale: 1.05 }} className="hover:text-white transition duration-200 cursor-pointer">
          Contact
        </motion.a>

        {/* Separator Line */}
        <div className="w-px h-6 bg-white/20 mx-2"></div> 

        {/* Sign In Button */}
        <motion.button
          className="px-6 py-2 border border-white/40 rounded-lg hover:bg-white/10 transition cursor-pointer font-semibold text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
        >
          Sign In
        </motion.button>
        
        {/* Prominent CTA Button
        <motion.button
          className="px-6 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition cursor-pointer font-semibold text-sm shadow-lg shadow-teal-500/30"
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(52, 211, 163, 0.6)' }}
          whileTap={{ scale: 0.96 }}
        >
          Get Started
        </motion.button> */}
      </motion.div>

      {/* 3. Mobile Menu Icon (Hidden on large screens) */}
      <div className="md:hidden">
        <button className="p-2 text-white hover:text-teal-400 transition">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </motion.nav>
  );
}