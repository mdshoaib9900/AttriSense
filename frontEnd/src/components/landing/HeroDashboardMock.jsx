import mockImage from "@/assets/mock-image1.png";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";

// Tilt parameters
const TILT_RANGE = 5; // Max degree of tilt
const SHADOW_OFFSET = 20; // How much the shadow moves

export function HeroDashboardMock() {
  const cardRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Motion values to track mouse position within the card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Function to handle mouse movement and update motion values
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    // Get the bounds of the element
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to the center (normalized to -0.5 to 0.5)
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;

    // Update Framer Motion values
    mouseX.set(x / width);
    mouseY.set(y / height);
  };

  // 3D Transform calculations: tilt based on mouse position
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [TILT_RANGE, -TILT_RANGE]); // Tilt up/down
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-TILT_RANGE, TILT_RANGE]); // Tilt left/right

  // Dynamic Shadow calculation: shadow shifts opposite to the tilt
  const shadowX = useTransform(mouseX, [-0.5, 0.5], [SHADOW_OFFSET, -SHADOW_OFFSET]);
  const shadowY = useTransform(mouseY, [-0.5, 0.5], [SHADOW_OFFSET, -SHADOW_OFFSET]);

  return (
    <motion.div
      ref={cardRef}
      className="relative w-[900px] m-[5rem] md:mt-10 cursor-pointer"
      initial={{ opacity: 0, scale: 0.85, y: 60 }} // Slight adjustment for a cleaner lift
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.0, ease: "easeOut" }}
      
      // INTERACTIVITY HANDLERS
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        // Reset the rotation smoothly on mouse leave
        mouseX.set(0);
        mouseY.set(0);
      }}
      
      // Apply the 3D transforms
      style={{
        transformStyle: "preserve-3d", // Essential for 3D perspective
        rotateX,
        rotateY,
      }}
    >
      {/* 1. Glossy Border Glow (Updated Color) */}
      <motion.div
        className="absolute -inset-4 rounded-[40px] blur-2xl opacity-70"
        // Use a branded color for the glow
        style={{
          background: "",
        }}
        animate={{ opacity: isHovering ? [0.4, 0.9, 0.4] : [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* 2. Dynamic Shadow Layer */}
      <motion.div
        className="absolute -inset-6 rounded-[40px] pointer-events-none"
        style={{
          x: shadowX,
          y: shadowY,
        }}
        transition={{ type: "spring", stiffness: 70, damping: 20 }}
      />


      {/* 3. Outer White Border Container */}
      <div className="p-6 bg-white/10 backdrop-blur-xl rounded-[40px] border border-white/40">
        <motion.img
          src={mockImage}
          alt="Dashboard Mock"
          className="w-[1400px] h-[600px] rounded-3xl object-cover"
          // Removed scale hover here as it conflicts with the 3D tilt
        />
      </div>
    </motion.div>
  );
}