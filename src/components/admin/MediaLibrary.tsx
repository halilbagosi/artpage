"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import clsx from "clsx";
import type { MediaFile } from "@/lib/schema";
import MediaSheet from "./MediaSheet";
import { formatSize, MediaThumb, uploadFiles } from "./ui";

export default function MediaLibrary({
  media,
  usage,
  onChanged,
}: {
  media: MediaFile[];
  usage: Record<string, string[]>;
  onChanged: (message: string) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Held as the file itself (not looked up by name) so the panel stays open
  // across a rename or new version while the library refreshes
  const [selected, setSelected] = useState<MediaFile | null>(null);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      const saved = await uploadFiles(files);
      await onChanged(
        saved.length === 1 ? `${saved[0].name} uploaded` : `${saved.length} files uploaded`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          upload(e.dataTransfer.files);
        }}
        className={clsx(
          "flex w-full flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center transition-colors",
          dragging
            ? "border-world-accent bg-world-accent/5"
            : "border-world-hairline hover:bg-world-surface/60"
        )}
      >
        <span className="text-[15px] font-medium">
          {uploading ? "Uploading…" : "Drop images or videos here, or click to choose"}
        </span>
        <span className="mt-1 text-[13px] text-world-muted">
          JPG, PNG, WebP, GIF, AVIF, MP4, WebM or MOV — saved to public/media
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => upload(e.target.files)}
      />

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-[#b3261e]/8 px-4 py-2.5 text-sm text-[#b3261e]">
          {error}
        </p>
      )}

      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {media.map((file) => {
          const usedBy = usage[file.url] ?? [];
          return (
            <li key={file.name} className="min-w-0">
              <button
                type="button"
                onClick={() => setSelected(file)}
                className="group block w-full text-left outline-none"
                aria-label={`Edit ${file.name}`}
              >
                <MediaThumb
                  url={file.url}
                  kind={file.kind}
                  className="aspect-square rounded-lg transition-transform duration-200 group-hover:shadow-[0_12px_30px_-14px_rgba(0,0,0,0.35)] group-active:scale-[0.98] group-focus-visible:ring-2 group-focus-visible:ring-world-accent"
                />
                <p className="mt-2 truncate text-[13px] font-medium" title={file.name}>
                  {file.name}
                </p>
                <p className="truncate text-[12px] text-world-muted" title={usedBy.join(", ")}>
                  {formatSize(file.size)} ·{" "}
                  {usedBy.length ? `Used by ${usedBy.join(", ")}` : "Unused"}
                </p>
              </button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {selected && (
          <MediaSheet
            key="media-sheet"
            file={selected}
            usedBy={usage[selected.url] ?? []}
            onClose={() => setSelected(null)}
            onChanged={async (message, next) => {
              setSelected(next);
              await onChanged(message);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
