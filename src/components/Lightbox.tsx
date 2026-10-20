"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export interface LightboxItem {
  image: string;
  title?: string;
  meta?: string;
}

/** Horizontal drag distance (px) that counts as a swipe to the next image. */
const SWIPE = 60;

export default function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
  position,
}: {
  item: LightboxItem | null;
  onClose: () => void;
  /** When given, the viewer can step through a set with arrows, keys and swipes */
  onPrev?: () => void;
  onNext?: () => void;
  /** e.g. "3 / 8" */
  position?: string;
}) {
  // A swipe ends in a click on the backdrop; this keeps it from closing
  const swiped = useRef(false);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev?.();
      else if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose, onPrev, onNext]);

  // Locked only on open/close, so stepping between images doesn't flicker it
  const isOpen = !!item;
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/92 p-4 md:p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            if (swiped.current) swiped.current = false;
            else onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={item.title || "Image"}
        >
          <motion.div
            className="relative h-[78vh] w-full max-w-6xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={item.image}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                drag={onPrev && onNext ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragStart={() => (swiped.current = true)}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE) onNext?.();
                  else if (info.offset.x > SWIPE) onPrev?.();
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title ?? ""}
                  fill
                  sizes="100vw"
                  draggable={false}
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <div className="mt-5 text-center">
            {item.title && <div className="font-serif text-xl text-white">{item.title}</div>}
            {(item.meta || position) && (
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-white/60">
                {[item.meta, position].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
          {onPrev && onNext && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                aria-label="Previous image"
                className="absolute left-1 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center font-mono text-3xl text-white/60 transition-colors hover:text-white md:left-4"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                aria-label="Next image"
                className="absolute right-1 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center font-mono text-3xl text-white/60 transition-colors hover:text-white md:right-4"
              >
                ›
              </button>
            </>
          )}
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
