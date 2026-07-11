"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const WORLDS = [
  {
    key: "art",
    href: "/art",
    label: "Art",
    numeral: "I",
    tagline: "The Atelier",
    image: "/media/FullSizeRender.jpg",
    bg: "#f5f1e8",
  },
  {
    key: "photography",
    href: "/photography",
    label: "Photography",
    numeral: "II",
    tagline: "The Darkroom",
    image: "/media/P1155212.jpg",
    bg: "#000000",
  },
  {
    key: "film",
    href: "/film",
    label: "Film",
    numeral: "III",
    tagline: "The Screening Room",
    image: "/media/P1144772.jpg",
    bg: "#0a0a0c",
  },
] as const;

export default function Gateway() {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const [entering, setEntering] = useState<(typeof WORLDS)[number] | null>(null);

  const enter = (world: (typeof WORLDS)[number]) => {
    if (entering) return;
    setEntering(world);
    setTimeout(() => router.push(world.href), 550);
  };

  useEffect(() => {
    WORLDS.forEach((w) => router.prefetch(w.href));
    const onKey = (e: KeyboardEvent) => {
      const idx = ["1", "2", "3"].indexOf(e.key);
      if (idx !== -1) enter(WORLDS[idx]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entering]);

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row overflow-hidden bg-[#0c0b09]">
      {WORLDS.map((world) => {
        const isHovered = hovered === world.key;
        const isDimmed = hovered !== null && !isHovered;
        return (
          <motion.button
            key={world.key}
            onMouseEnter={() => setHovered(world.key)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(world.key)}
            onBlur={() => setHovered(null)}
            onClick={() => enter(world)}
            aria-label={`Enter ${world.label}`}
            className="relative block min-h-0 min-w-0 cursor-pointer overflow-hidden text-left outline-none"
            animate={{ flexGrow: isHovered ? 2.1 : 1 }}
            initial={{ flexGrow: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ flexBasis: 0 }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: isHovered ? 1.04 : 1.12,
                filter: isHovered
                  ? "grayscale(0%) brightness(0.95)"
                  : isDimmed
                    ? "grayscale(80%) brightness(0.4)"
                    : "grayscale(45%) brightness(0.65)",
              }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={world.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover"
              />
            </motion.div>

            {/* Panel caption */}
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <div className="font-mono text-[11px] tracking-[0.35em] text-white/60 uppercase">
                {world.numeral}
              </div>
              <div className="mt-2 font-serif text-3xl md:text-5xl text-white">
                {world.label}
              </div>
              <motion.div
                className="mt-2 font-mono text-[11px] tracking-[0.3em] uppercase text-white/70"
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
                transition={{ duration: 0.4 }}
              >
                {world.tagline} →
              </motion.div>
            </div>

            {/* Hairline divider between panels */}
            <div className="absolute inset-y-0 right-0 hidden w-px bg-white/15 md:block" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/15 md:hidden" />
          </motion.button>
        );
      })}

      {/* Artist name blended across all panels */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden items-center justify-center md:flex">
        <h1
          className="text-center font-serif text-[7vw] leading-none tracking-tight text-white"
          style={{ mixBlendMode: "difference" }}
        >
          Halil Bagosi
        </h1>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-5 md:hidden">
        <h1 className="font-serif text-2xl text-white" style={{ mixBlendMode: "difference" }}>
          Halil Bagosi
        </h1>
      </div>

      {/* Footer hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 hidden justify-center md:flex">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">
          Press 1 · 2 · 3 — or choose a world
        </span>
      </div>

      {/* Entry transition: the chosen world's color floods the screen */}
      <AnimatePresence>
        {entering && (
          <motion.div
            className="absolute inset-0 z-20"
            style={{ backgroundColor: entering.bg }}
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(75% at 50% 50%)" }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
