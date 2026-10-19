"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { MediaFile, MediaKind } from "@/lib/schema";
import { buttonClass, MediaThumb, uploadFiles } from "./ui";

const SPRING = { type: "spring", bounce: 0, duration: 0.35 } as const;

/** Modal library browser: pick an existing file or upload a new one. */
export default function MediaPicker({
  media,
  accept,
  current,
  onPick,
  onClose,
  onUploaded,
}: {
  media: MediaFile[];
  accept: MediaKind;
  current?: string;
  onPick: (url: string) => void;
  onClose: () => void;
  onUploaded: () => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const files = media.filter((m) => m.kind === accept);

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
      const [saved] = await uploadFiles(list);
      await onUploaded();
      onPick(saved.url);
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
        aria-label={`Choose ${accept}`}
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-world-bg shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] md:rounded-2xl"
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 24, opacity: 0, scale: 0.98 }}
        transition={SPRING}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 border-b border-world-hairline px-5 py-4">
          <h2 className="text-[15px] font-semibold">
            Choose {accept === "image" ? "an image" : "a video"}
          </h2>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept={accept === "image" ? "image/*" : "video/*"}
              className="hidden"
              onChange={(e) => upload(e.target.files)}
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
                    onClick={() => onPick(file.url)}
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
                        file.url === current && "ring-2 ring-world-accent"
                      )}
                    />
                    <span className="mt-1.5 block truncate text-[12px] text-world-muted">
                      {file.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
