'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useModeStore } from '@/store/useModeStore';
import { Play } from 'lucide-react';

export default function CustomCursor() {
  const mode = useModeStore((state) => state.mode);
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false); // Default false, verify on mount

  // Use Framer Motion values instead of React state for performance
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only show custom cursor if the device has a fine pointer
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointer(mediaQuery.matches);
    
    const mediaHandler = (e: MediaQueryListEvent) => setIsPointer(e.matches);
    mediaQuery.addEventListener('change', mediaHandler);

    if (!mediaQuery.matches) {
      return () => mediaQuery.removeEventListener('change', mediaHandler);
    }

    // Only now — once we know a custom cursor will actually render — hide the
    // native one. Prevents an invisible-cursor dead state if this never mounts.
    document.body.classList.add('cursor-armed');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('input')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', mediaHandler);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('cursor-armed');
    };
  }, [mouseX, mouseY]);

  if (!isPointer) return null;

  const variants = {
    painting: {
      width: isHovering ? 64 : 32,
      height: isHovering ? 64 : 32,
      backgroundColor: 'rgba(180, 83, 9, 0.4)',
      borderRadius: isHovering ? '40% 60% 70% 30% / 40% 50% 60% 50%' : '50%',
      border: 'none',
    },
    photography: {
      width: isHovering ? 48 : 24,
      height: isHovering ? 48 : 24,
      backgroundColor: 'transparent',
      borderRadius: '0',
      border: '2px solid rgba(255, 255, 255, 0.8)',
    },
    videography: {
      width: isHovering ? 56 : 32,
      height: isHovering ? 56 : 32,
      backgroundColor: isHovering ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.4)',
    }
  };

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[99999] flex items-center justify-center mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={variants[mode]}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {mode === 'videography' && isHovering && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white"
        >
          <Play size={16} fill="white" />
        </motion.div>
      )}
      
      {mode === 'photography' && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white -translate-x-[2px] -translate-y-[2px]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white translate-x-[2px] -translate-y-[2px]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white -translate-x-[2px] translate-y-[2px]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white translate-x-[2px] translate-y-[2px]" />
        </>
      )}
    </motion.div>
  );
}
