
"use client";

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { createPortal } from 'react-dom';

export const CustomCursor = () => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the outer cursor
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const [cursorVariant, setCursorVariant] = useState("default");
  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    setMounted(true);
    
    // Only initialize and show cursor on devices that support hover (desktop/mouse)
    // This prevents the cursor from getting stuck on mobile screens
    const mediaQuery = window.matchMedia('(hover: hover)');
    if (!mediaQuery.matches) return;

    const moveCursor = (e: MouseEvent) => {
      // Ensure cursor becomes visible only after moving to avoid starting at 0,0
      if (!isVisible) setIsVisible(true);

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      if (!target) return;

      const isPointer = window.getComputedStyle(target).cursor === 'pointer' || 
                        target.closest('a') || 
                        target.closest('button') ||
                        target.closest('[role="button"]');
      
      const customCursorLabel = target.closest('[data-cursor]')?.getAttribute('data-cursor');

      if (customCursorLabel) {
        setCursorVariant("custom");
        setCursorText(customCursorLabel);
      } else if (isPointer) {
        setCursorVariant("pointer");
        setCursorText("");
      } else {
        setCursorVariant("default");
        setCursorText("");
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [mouseX, mouseY, isVisible]);

  if (!mounted || !isVisible) return null;

  const variants = {
    default: {
      height: 16,
      width: 16,
      backgroundColor: "white",
      mixBlendMode: "difference" as any,
      borderRadius: "100%",
    },
    pointer: {
      height: 40,
      width: 40,
      backgroundColor: "white",
      mixBlendMode: "difference" as any,
      borderRadius: "100%",
    },
    custom: {
      height: 80,
      width: 80,
      backgroundColor: "white",
      mixBlendMode: "difference" as any,
      borderRadius: "100%",
    }
  };

  const cursorContent = (
    <div className="fixed inset-0 pointer-events-none z-[999999999]">
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center overflow-hidden"
        animate={cursorVariant}
        variants={variants}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      >
        {cursorVariant === "custom" && (
          <span className="text-[10px] font-black uppercase tracking-tighter text-black">
            {cursorText}
          </span>
        )}
      </motion.div>
      <motion.div 
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </div>
  );

  return createPortal(cursorContent, document.body);
};
