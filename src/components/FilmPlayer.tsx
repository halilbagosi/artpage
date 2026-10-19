"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Film } from "@/lib/content";
import { videoEmbed } from "@/lib/video";

/** Whether a film has something to play full screen: a Vimeo/YouTube link or a local video. */
export function isPlayable(film: Pick<Film, "link" | "video">): boolean {
  return !!videoEmbed(film.link) || !!film.video;
}

/**
 * Full-screen screening of one film, with sound and the player's controls.
 * Plays the film's Vimeo/YouTube link if it has one, otherwise its local video.
 * Leaving full screen (Esc) closes the player.
 */
export default function FilmPlayer({
  film,
  onClose,
}: {
  film: Film | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {film && <Screening key={film.slug} film={film} onClose={onClose} />}
    </AnimatePresence>
  );
}

function Screening({ film, onClose }: { film: Film; onClose: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Latest onClose without re-running the mount effect (which would leave full screen)
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const close = () => onCloseRef.current();
    const stage = stageRef.current;
    const opener = document.activeElement as HTMLElement | null;
    let wentFullscreen = false;

    const onFullscreenChange = () => {
      if (document.fullscreenElement === stage) wentFullscreen = true;
      else if (wentFullscreen) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    // Still inside the click that opened the player, so the browser allows it.
    // Where element full screen isn't supported (iPhone), the overlay already fills the viewport.
    stage?.requestFullscreen?.().catch(() => {});

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      opener?.focus();
    };
  }, []);

  const embed = videoEmbed(film.link);

  return (
    <motion.div
      ref={stageRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-modal="true"
      aria-label={film.title}
    >
      {embed ? (
        <iframe
          src={embed.src}
          title={film.title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          className="aspect-video max-h-full w-full max-w-[calc(100vh*16/9)] border-0"
        />
      ) : (
        film.video && (
          <video
            src={film.video}
            poster={film.poster}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-contain"
          />
        )
      )}
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close film"
        className="absolute right-5 top-5 z-10 font-mono text-xs uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white"
      >
        Esc / Close
      </button>
    </motion.div>
  );
}
