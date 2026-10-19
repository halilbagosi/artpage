"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { MediaFile } from "@/lib/schema";
import { api, buttonClass, Field, formatSize, inputClass, sendJson } from "./ui";

const SPRING = { type: "spring", bounce: 0, duration: 0.4 } as const;

function splitName(name: string) {
  const dot = name.lastIndexOf(".");
  return { stem: name.slice(0, dot), ext: name.slice(dot) };
}

/**
 * Detail panel for one library file: preview, rename, replace, rotate and
 * delete. Every edit keeps the pages that use the file pointing at it.
 */
export default function MediaSheet({
  file,
  usedBy,
  onClose,
  onChanged,
}: {
  file: MediaFile;
  usedBy: string[];
  onClose: () => void;
  /** Called after any change; `next` is the file to keep showing, or null if deleted */
  onChanged: (message: string, next: MediaFile | null) => Promise<void>;
}) {
  const { stem, ext } = splitName(file.name);
  // Draft name belongs to one file; switching files falls back to its real name
  const [draft, setDraft] = useState({ for: file.name, value: stem });
  const nameValue = draft.for === file.name ? draft.value : stem;
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const rotatable = file.kind === "image" && ext.toLowerCase() !== ".gif";

  useEffect(() => {
    let live = true;
    api<{ dimensions: { width: number; height: number } | null }>(
      `/api/admin/media/${encodeURIComponent(file.name)}`
    )
      .then(({ dimensions }) => live && setDimensions(dimensions))
      .catch(() => live && setDimensions(null));
    return () => {
      live = false;
    };
  }, [file.name]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  const run = async (label: string, action: () => Promise<[string, MediaFile | null]>) => {
    setBusy(label);
    setError(null);
    try {
      const [message, next] = await action();
      await onChanged(message, next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  };

  const url = `/api/admin/media/${encodeURIComponent(file.name)}`;

  const rename = (e: React.FormEvent) => {
    e.preventDefault();
    run("Renaming…", async () => {
      const { file: next } = await api<{ file: MediaFile }>(
        url,
        sendJson("PATCH", { action: "rename", name: nameValue })
      );
      return [`Renamed to ${next.name}`, next];
    });
  };

  const rotate = (degrees: 90 | -90) =>
    run("Rotating…", async () => {
      const { file: next } = await api<{ file: MediaFile }>(
        url,
        sendJson("PATCH", { action: "rotate", degrees })
      );
      return ["Image rotated", next];
    });

  const replace = (files: FileList | null) => {
    const upload = files?.[0];
    if (!upload) return;
    run("Replacing…", async () => {
      const form = new FormData();
      form.append("file", upload);
      const { file: next } = await api<{ file: MediaFile }>(url, { method: "PUT", body: form });
      return [usedBy.length ? `Replaced in ${usedBy.length} place${usedBy.length === 1 ? "" : "s"}` : "File replaced", next];
    });
  };

  const remove = () => {
    const message = usedBy.length
      ? `Delete ${file.name}?\n\nIt's used by: ${usedBy.join(", ")}.\nThose will be left without this ${file.kind} — entries missing their main image are hidden on the site until you choose a new one.`
      : `Delete ${file.name} from public/media?`;
    if (!window.confirm(message)) return;
    run("Deleting…", async () => {
      await api(`${url}${usedBy.length ? "?force=1" : ""}`, { method: "DELETE" });
      return [`${file.name} deleted`, null];
    });
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 bg-black/25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => !busy && onClose()}
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={file.name}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-world-bg shadow-[-30px_0_80px_-30px_rgba(0,0,0,0.35)]"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={SPRING}
      >
        <header className="flex items-center justify-between gap-4 border-b border-world-hairline px-6 py-4">
          <div className="min-w-0">
            <p className="type-label text-world-muted">Media</p>
            <h2 className="mt-1 truncate font-serif text-2xl tracking-[-0.01em]">{file.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={!!busy}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-world-muted transition-colors hover:bg-world-surface hover:text-world-ink"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
          {/* Preview */}
          <div className="relative grid h-[42vh] min-h-56 place-items-center overflow-hidden rounded-xl bg-[repeating-conic-gradient(rgba(0,0,0,0.04)_0%_25%,transparent_0%_50%)] bg-[length:20px_20px]">
            {file.kind === "video" ? (
              <video key={file.url} src={file.url} controls playsInline className="max-h-full max-w-full" />
            ) : (
              <Image key={file.url} src={file.url} alt="" fill sizes="600px" className="object-contain" />
            )}
            {busy && (
              <div className="absolute inset-0 grid place-items-center bg-world-bg/70 text-sm font-medium backdrop-blur-sm">
                {busy}
              </div>
            )}
          </div>

          <p className="text-[13px] text-world-muted">
            {[
              dimensions && `${dimensions.width} × ${dimensions.height}`,
              formatSize(file.size),
              file.kind === "image" ? "Image" : "Video",
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>

          {/* Rename */}
          <form onSubmit={rename}>
            <Field label="File name" htmlFor="media-name">
              <div className="flex gap-2">
                <div className="flex min-w-0 flex-1 items-center rounded-lg border border-world-hairline bg-white/70 pr-3 transition-[border-color,box-shadow] focus-within:border-world-accent focus-within:ring-2 focus-within:ring-world-accent/20">
                  <input
                    id="media-name"
                    value={nameValue}
                    onChange={(e) => setDraft({ for: file.name, value: e.target.value })}
                    className={`${inputClass} border-0 bg-transparent focus:ring-0`}
                  />
                  <span className="shrink-0 text-[15px] text-world-muted">{ext}</span>
                </div>
                <button
                  type="submit"
                  className={buttonClass.secondary}
                  disabled={!!busy || !nameValue.trim() || nameValue === stem}
                >
                  Rename
                </button>
              </div>
            </Field>
          </form>

          {/* Edit */}
          <div className="space-y-2">
            <p className="text-[13px] font-medium text-world-ink/80">Edit</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={buttonClass.secondary} disabled={!!busy} onClick={() => replaceInput.current?.click()}>
                Replace with new file…
              </button>
              {rotatable && (
                <>
                  <button type="button" className={buttonClass.secondary} disabled={!!busy} onClick={() => rotate(-90)} aria-label="Rotate left">
                    ↺ Rotate left
                  </button>
                  <button type="button" className={buttonClass.secondary} disabled={!!busy} onClick={() => rotate(90)} aria-label="Rotate right">
                    ↻ Rotate right
                  </button>
                </>
              )}
            </div>
            <input
              ref={replaceInput}
              type="file"
              accept={file.kind === "image" ? "image/*" : "video/*"}
              className="hidden"
              onChange={(e) => {
                replace(e.target.files);
                e.target.value = "";
              }}
            />
            <p className="text-[12px] text-world-muted">
              Edits save as a new version and every page using this file switches to it.
            </p>
          </div>

          {/* Usage */}
          <div className="space-y-2">
            <p className="text-[13px] font-medium text-world-ink/80">Used by</p>
            {usedBy.length ? (
              <ul className="divide-y divide-world-hairline rounded-lg border border-world-hairline bg-white/50 text-[14px]">
                {usedBy.map((label, i) => (
                  <li key={`${label}-${i}`} className="px-3 py-2">
                    {label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[14px] text-world-muted">Not used anywhere yet.</p>
            )}
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-[#b3261e]/8 px-4 py-2.5 text-sm text-[#b3261e]">
              {error}
            </p>
          )}
        </div>

        <footer className="flex items-center gap-2 border-t border-world-hairline px-6 py-4">
          <button type="button" className={buttonClass.danger} onClick={remove} disabled={!!busy}>
            Delete file
          </button>
          <a href={file.url} target="_blank" rel="noreferrer" className={`${buttonClass.secondary} ml-auto`}>
            Open original ↗
          </a>
          <button type="button" className={buttonClass.primary} onClick={onClose} disabled={!!busy}>
            Done
          </button>
        </footer>
      </motion.aside>
    </>
  );
}
