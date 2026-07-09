'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLightboxStore } from '@/store/useLightboxStore';

/**
 * A single, shared full-screen image viewer used across all three worlds.
 * Any component opens it via useLightboxStore().open({ image, title, meta }).
 * Dismiss with the close button, a click on the backdrop, or the Escape key.
 */
export default function Lightbox() {
  const item = useLightboxStore((s) => s.item);
  const close = useLightboxStore((s) => s.close);

  // Lock body scroll and wire up Escape while the lightbox is open.
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [item, close]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={item.title || 'Image viewer'}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

          {/* Close button */}
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-11 h-11 rounded-full border border-white/25 text-white/80 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image + caption */}
          <motion.figure
            className="relative z-[1] flex flex-col items-center max-w-full max-h-full"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.title || ''}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            {(item.title || item.meta) && (
              <figcaption className="mt-4 text-center text-white">
                {item.title && (
                  <p className="text-base sm:text-lg font-medium">{item.title}</p>
                )}
                {item.meta && (
                  <p className="mt-1 text-xs uppercase tracking-widest text-white/50">
                    {item.meta}
                  </p>
                )}
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
