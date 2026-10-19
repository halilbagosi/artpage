"use client";

/** Full-frame button over a film still: a projector-style play mark that brightens on hover. */
export default function PlayCue({ title, onPlay }: { title: string; onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play ${title}`}
      className="group/play absolute inset-0 flex cursor-pointer items-center justify-center focus-visible:outline-none"
    >
      <span className="type-label flex items-center gap-3 rounded-full border border-white/35 bg-black/35 px-5 py-3 text-white/85 backdrop-blur-sm transition-[transform,background-color,border-color,color] duration-200 group-hover/play:border-world-accent group-hover/play:bg-black/55 group-hover/play:text-white group-focus-visible/play:border-world-accent group-active/play:scale-[0.97]">
        <svg aria-hidden viewBox="0 0 10 12" className="h-2.5 w-2.5 fill-current">
          <path d="M0 0l10 6-10 6z" />
        </svg>
        Play film
      </span>
    </button>
  );
}
