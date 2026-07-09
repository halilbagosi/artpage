'use client';

import { useModeStore } from '@/store/useModeStore';
import { AnimatePresence, motion } from 'framer-motion';
import PaintingMode from '@/components/PaintingMode';
import PhotographyMode from '@/components/PhotographyMode';
import VideographyMode from '@/components/VideographyMode';

export default function Home() {
  const mode = useModeStore((state) => state.mode);

  return (
    <main className="flex-1 w-full min-h-screen relative overflow-x-hidden pt-32 px-6 pb-12">
      <AnimatePresence mode="wait">
        {mode === 'painting' && (
          <motion.div
            key="painting"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-h-full"
          >
            <PaintingMode />
          </motion.div>
        )}
        {mode === 'photography' && (
          <motion.div
            key="photography"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-h-full"
          >
            <PhotographyMode />
          </motion.div>
        )}
        {mode === 'videography' && (
          <motion.div
            key="videography"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-h-full"
          >
            <VideographyMode />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
