import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [pendingScroll, setPendingScroll] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Scroll with navigation support
  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      setPendingScroll(id);
      navigate("/");
      return;
    }

    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll after returning to "/"
  useEffect(() => {
    if (location.pathname === "/" && pendingScroll) {
      const section = document.getElementById(pendingScroll);
      if (section) section.scrollIntoView({ behavior: "smooth" });
      setPendingScroll(null);
    }
  }, [location.pathname, pendingScroll]);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 z-50 w-full py-4 transition-all duration-300 ${
        scrolled
          ? "bg-[#0b1120]/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      } flex items-center justify-between px-6 lg:px-14 text-white`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Branding */}
      <motion.h1
        className="text-3xl font-extrabold tracking-tight cursor-pointer"
        onClick={() => navigate("/")}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <span className="text-teal-400">Attri</span>Sense
      </motion.h1>

      {/* Desktop Navigation */}
      <motion.div
        className="hidden md:flex items-center gap-10 text-base font-medium text-slate-300"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <motion.a
          whileHover={{ scale: 1.05 }}
          onClick={() => scrollToSection("features")}
          className="hover:text-white transition duration-200 cursor-pointer"
        >
          Features
        </motion.a>

        <motion.a
          whileHover={{ scale: 1.05 }}
          onClick={() => scrollToSection("pricing")}
          className="hover:text-white transition duration-200 cursor-pointer"
        >
          Pricing
        </motion.a>

        <motion.a
          whileHover={{ scale: 1.05 }}
          onClick={() => scrollToSection("contact")}
          className="hover:text-white transition duration-200 cursor-pointer"
        >
          Contact
        </motion.a>

        <div className="w-px h-6 bg-white/20 mx-2"></div>

        {/* CONDITIONAL AUTH BUTTON */}
        {!isAuthenticated ? (
          <motion.button
            className="px-6 py-2 border border-white/40 rounded-lg hover:bg-white/10 transition cursor-pointer font-semibold text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/login")}
          >
            Sign In
          </motion.button>
        ) : (
          <motion.button
            className="px-6 py-2 border border-red-400 text-red-400 rounded-lg hover:bg-red-500/20 transition cursor-pointer font-semibold text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleLogout}
          >
            Logout
          </motion.button>
        )}
      </motion.div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <button className="p-2 text-white hover:text-teal-400 transition">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </motion.nav>
  );
}
