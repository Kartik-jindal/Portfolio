"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { createPortal } from 'react-dom';

export const CustomCursor = () => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorVariant, setCursorVariant] = useState("default");
  const [cursorText, setCursorText] = useState("");

  // Refs hold the latest values so the mousemove handler never goes stale
  const variantRef = useRef("default");
  const textRef = useRef("");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);

    // Only show on pointer/hover-capable devices (desktop with mouse)
    const mediaQuery = window.matchMedia('(hover: hover)');
    if (!mediaQuery.matches) return;

    // Also skip on narrow viewports (touch-primary devices)
    if (window.innerWidth < 768) return;

    const moveCursor = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      if (!target) return;

      const isPointer =
        window.getComputedStyle(target).cursor === 'pointer' ||
        !!target.closest('a') ||
        !!target.closest('button') ||
        !!target.closest('[role="button"]');

      const customLabel = target.closest('[data-cursor]')?.getAttribute('data-cursor') ?? null;

      let newVariant = "default";
      let newText = "";

      if (customLabel) {
        newVariant = "custom";
        newText = customLabel;
      } else if (isPointer) {
        newVariant = "pointer";
      }

      // Only trigger re-render when something actually changed
      if (newVariant !== variantRef.current) {
        variantRef.current = newVariant;
        setCursorVariant(newVariant);
      }
      if (newText !== textRef.current) {
        textRef.current = newText;
        setCursorText(newText);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  // Don't render until mounted and the user has moved the mouse at least once
  if (!mounted || !isVisible) return null;

  const variants = {
    default: {
      height: 16,
      width: 16,
      backgroundColor: "white",
      mixBlendMode: "difference" as const,
      borderRadius: "100%",
    },
    pointer: {
      height: 40,
      width: 40,
      backgroundColor: "white",
      mixBlendMode: "difference" as const,
      borderRadius: "100%",
    },
    custom: {
      height: 80,
      width: 80,
      backgroundColor: "white",
      mixBlendMode: "difference" as const,
      borderRadius: "100%",
    },
  };

  const cursorContent = (
    <div className="hidden md:block fixed inset-0 pointer-events-none z-[999999999]">
      {/* Outer spring-lagged ring */}
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
          <span className="text-[10px] font-black uppercase tracking-tighter text-black select-none">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Inner precise dot — follows mouse exactly */}
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
