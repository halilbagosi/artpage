"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { MediaFile, MediaKind } from "@/lib/schema";
import { buttonClass, MediaThumb, uploadFiles } from "./ui";

const SPRING = { type: "spring", bounce: 0, duration: 0.35 } as const;

type PickerProps = {
  media: MediaFile[];
  accept: MediaKind;
  onClose: () => void;
  onUploaded: () => Promise<void>;
} & (
  | { multiple?: false; current?: string; onPick: (url: string) => void }
  | { multiple: true; current?: string[]; onPick: (urls: string[]) => void }
);

/**
 * Modal library browser: pick an existing file or upload a new one. With
 * `multiple`, tiles toggle a selection and uploads join it.
 */
export default function MediaPicker(props: PickerProps) {
  const { media, accept, onClose, onUploaded } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>(
    props.multiple ? (props.current ?? []) : []
  );
  const files = media.filter((m) => m.kind === accept);
  const isCurrent = (url: string) =>
    props.multiple ? selected.includes(url) : url === props.current;

  const choose = (url: string) => {
    if (!props.multiple) return props.onPick(url);
    setSelected((s) => (s.includes(url) ? s.filter((u) => u !== url) : [...s, url]));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    // Capture so Esc closes the picker before the sheet underneath
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  const upload = async (list: FileList | null) => {
    if (!list?.length) return;
    setUploading(true);
    setError(null);
    try {
      const saved = await uploadFiles(list);
      await onUploaded();
      if (props.multiple) {
        const urls = saved.map((f) => f.url);
        setSelected((s) => [...s, ...urls.filter((u) => !s.includes(u))]);
      } else {
        props.onPick(saved[0].url);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Portalled: the sheet that opens this is transformed, which would otherwise
  // trap a fixed-position overlay inside it
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/30 p-0 md:items-center md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={props.multiple ? `Choose ${accept}s` : `Choose ${accept}`}
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-world-bg shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] md:rounded-2xl"
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 24, opacity: 0, scale: 0.98 }}
        transition={SPRING}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 border-b border-world-hairline px-5 py-4">
          <h2 className="text-[15px] font-semibold">
            {props.multiple
              ? `Choose ${accept}s`
              : `Choose ${accept === "image" ? "an image" : "a video"}`}
          </h2>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept={accept === "image" ? "image/*" : "video/*"}
              multiple={props.multiple}
              className="hidden"
              onChange={(e) => {
                upload(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              className={buttonClass.primary}
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? "Uploading…" : "Upload new"}
            </button>
            <button type="button" className={buttonClass.secondary} onClick={onClose}>
              Cancel
            </button>
          </div>
        </header>

        {error && (
          <p role="alert" className="border-b border-world-hairline bg-[#b3261e]/8 px-5 py-2.5 text-sm text-[#b3261e]">
            {error}
          </p>
        )}

        <div className="overflow-y-auto p-5">
          {files.length === 0 ? (
            <p className="py-16 text-center text-sm text-world-muted">
              No {accept === "image" ? "images" : "videos"} yet — upload one to get started.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {files.map((file) => (
                <li key={file.name}>
                  <button
                    type="button"
                    onClick={() => choose(file.url)}
                    aria-pressed={props.multiple ? selected.includes(file.url) : undefined}
                    className={clsx(
                      "group block w-full text-left outline-none",
                      "focus-visible:[&>div]:ring-2 focus-visible:[&>div]:ring-world-accent"
                    )}
                  >
                    <MediaThumb
                      url={file.url}
                      kind={file.kind}
                      className={clsx(
                        "aspect-square rounded-lg ring-offset-2 ring-offset-world-bg transition-transform duration-200 group-active:scale-[0.97]",
                        isCurrent(file.url) && "ring-2 ring-world-accent"
                      )}
                    />
                    {props.multiple && selected.includes(file.url) && (
                      <span className="-mt-7 ml-1.5 relative z-10 grid h-5 min-w-5 w-fit place-items-center rounded-full bg-world-accent px-1.5 text-[11px] font-semibold tabular-nums text-world-bg">
                        {selected.indexOf(file.url) + 1}
                      </span>
                    )}
                    <span className="mt-1.5 block truncate text-[12px] text-world-muted">
                      {file.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {props.multiple && (
          <footer className="flex items-center justify-between gap-4 border-t border-world-hairline px-5 py-3">
            <p className="text-sm text-world-muted">
              {selected.length
                ? `${selected.length} selected`
                : `Click ${accept}s to select them, or upload several at once`}
            </p>
            <button
              type="button"
              className={buttonClass.primary}
              disabled={uploading}
              onClick={() => props.onPick(selected)}
            >
              Done
            </button>
          </footer>
        )}
      </motion.div>
    </motion.div>,
    document.body
  );
}
