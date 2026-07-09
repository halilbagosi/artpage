'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useModeStore, PortfolioMode } from '@/store/useModeStore';

// Each world's base surface colour. The curtain enters in the *incoming*
// world's colour so the swap reads as one deliberate wipe rather than an
// abrupt repaint of every element at once.
const WORLD_COLOR: Record<PortfolioMode, string> = {
  painting: '#fdfbf7',
  photography: '#000000',
  videography: '#000000',
};

export default function WorldTransition() {
  const mode = useModeStore((state) => state.mode);

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={mode}
          className="absolute inset-0"
          style={{ backgroundColor: WORLD_COLOR[mode], transformOrigin: 'top' }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
        />
      </AnimatePresence>
    </div>
  );
}
