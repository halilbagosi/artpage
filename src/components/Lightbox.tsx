"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export interface LightboxItem {
  image: string;
  title: string;
  meta?: string;
}

export default function Lightbox({
  item,
  onClose,
}: {
  item: LightboxItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/92 p-4 md:p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          <motion.div
            className="relative h-[78vh] w-full max-w-6xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </motion.div>
          <div className="mt-5 text-center">
            <div className="font-serif text-xl text-white">{item.title}</div>
            {item.meta && (
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-white/60">
                {item.meta}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 font-mono text-xs uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white"
          >
            Esc / Close
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
