
"use client";

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [mounted, setMounted] = useState(false);
  const cursorX = useSpring(0, { damping: 20, stiffness: 200 });
  const cursorY = useSpring(0, { damping: 20, stiffness: 200 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    setMounted(true);
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);

      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a'
      );
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <motion.div
      className="custom-cursor w-8 h-8 rounded-full border border-accent flex items-center justify-center pointer-events-none hidden lg:flex"
      style={{
        x: cursorX,
        y: cursorY,
        scale: isPointer ? 1.5 : 1,
        backgroundColor: isPointer ? 'rgba(86, 203, 222, 0.2)' : 'transparent',
      }}
    >
      <div className="w-1 h-1 bg-accent rounded-full" />
    </motion.div>
  );
};
