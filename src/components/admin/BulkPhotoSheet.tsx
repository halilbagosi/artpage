"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SHOOT_TYPES, type Entry, type MediaFile } from "@/lib/schema";
import MediaPicker from "./MediaPicker";
import { api, buttonClass, Field, inputClass, MediaThumb, sendJson, uploadFiles } from "./ui";

const SPRING = { type: "spring", bounce: 0, duration: 0.4 } as const;

/** Side sheet for adding several pictures to one shoot in a single go. */
export default function BulkPhotoSheet({
  entries,
  media,
  onClose,
  onSaved,
  onUploaded,
}: {
  /** Existing photography entries, to suggest shoot names */
  entries: Entry[];
  media: MediaFile[];
  onClose: () => void;
  onSaved: (message: string) => Promise<void>;
  onUploaded: () => Promise<void>;
}) {
  const [client, setClient] = useState("");
  const [category, setCategory] = useState("");
  const [shootType, setShootType] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [picking, setPicking] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const clientInput = useRef<HTMLInputElement>(null);
  const clients = [...new Set(entries.map((e) => e.client?.trim()).filter(Boolean))].sort();
  const dirty = images.length > 0 || client !== "" || category !== "" || shootType !== "";

  // An existing shoot already has a type: carry it over
  const pickClient = (value: string) => {
    setClient(value);
    const existing = entries.find((e) => e.client?.trim() === value.trim() && e.shootType);
    if (existing) setShootType(existing.shootType);
  };

  const requestClose = () => {
    if (!dirty || window.confirm("Discard these pictures?")) onClose();
  };

  useEffect(() => {
    clientInput.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const add = (urls: string[]) =>
    setImages((current) => [...current, ...urls.filter((u) => !current.includes(u))]);

  const upload = async (list: FileList | null) => {
    if (!list?.length) return;
    setUploading(true);
    setError(null);
    try {
      const saved = await uploadFiles(list);
      await onUploaded();
      add(saved.map((f) => f.url));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return;
    setBusy(true);
    setError(null);
    let done = 0;
    try {
      for (const image of images) {
        await api("/api/admin/entries/photography", sendJson("POST", { image, client, category, shootType }));
        done++;
      }
      const what = `${done} picture${done > 1 ? "s" : ""}`;
      await onSaved(client ? `${what} added to ${client}` : `${what} added`);
      onClose();
    } catch (err) {
      // Drop the ones that made it so a retry doesn't duplicate them
      setImages((current) => current.slice(done));
      if (done) await onUploaded();
      const reason = err instanceof Error ? err.message : "Could not save";
      setError(done ? `Added ${done}, then stopped: ${reason}` : reason);
      setBusy(false);
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 bg-black/25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={requestClose}
      />
      <motion.form
        role="dialog"
        aria-modal="true"
        aria-label="Add pictures"
        onSubmit={save}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-world-bg shadow-[-30px_0_80px_-30px_rgba(0,0,0,0.35)]"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={SPRING}
      >
        <header className="flex items-center justify-between gap-4 border-b border-world-hairline px-6 py-4">
          <div className="min-w-0">
            <p className="type-label text-world-muted">The Darkroom</p>
            <h2 className="mt-1 truncate font-serif text-2xl tracking-[-0.01em]">Add pictures</h2>
          </div>
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-world-muted transition-colors hover:bg-world-surface hover:text-world-ink"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          <Field
            label="Shoot / client"
            hint="Every picture below is added to this shoot"
            htmlFor="bulk-client"
          >
            <input
              id="bulk-client"
              ref={clientInput}
              list="bulk-clients"
              value={client}
              onChange={(e) => pickClient(e.target.value)}
              className={inputClass}
            />
            <datalist id="bulk-clients">
              {clients.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>

          <Field label="Shoot type" hint="Filters the Darkroom between client and business shoots" htmlFor="bulk-type">
            <select
              id="bulk-type"
              value={shootType}
              onChange={(e) => setShootType(e.target.value)}
              className={inputClass}
            >
              <option value="">—</option>
              {SHOOT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Caption" hint="Optional — applied to every picture, e.g. Room 1" htmlFor="bulk-category">
            <input
              id="bulk-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label={`Pictures *${images.length ? ` (${images.length})` : ""}`}>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                upload(e.target.files);
                e.target.value = "";
              }}
            />
            {images.length > 0 && (
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {images.map((url) => (
                  <li key={url} className="relative">
                    <MediaThumb url={url} kind="image" className="aspect-square rounded-md" sizes="120px" />
                    <button
                      type="button"
                      aria-label={`Remove ${url.replace("/media/", "")}`}
                      onClick={() => setImages((current) => current.filter((u) => u !== url))}
                      className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-[11px] text-white transition-colors hover:bg-black/75"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                className={buttonClass.secondary}
                disabled={uploading || busy}
                onClick={() => fileInput.current?.click()}
              >
                {uploading ? "Uploading…" : "Upload…"}
              </button>
              <button
                type="button"
                className={buttonClass.secondary}
                disabled={uploading || busy}
                onClick={() => setPicking(true)}
              >
                From library…
              </button>
            </div>
          </Field>
        </div>

        <footer className="border-t border-world-hairline px-6 py-4">
          {error && (
            <p role="alert" className="mb-3 text-sm text-[#b3261e]">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button type="button" className={buttonClass.secondary} onClick={requestClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={buttonClass.primary}
              disabled={busy || uploading || images.length === 0}
            >
              {busy
                ? "Saving…"
                : `Add ${images.length || ""} picture${images.length === 1 ? "" : "s"}`.replace("  ", " ")}
            </button>
          </div>
        </footer>
      </motion.form>

      <AnimatePresence>
        {picking && (
          <MediaPicker
            multiple
            media={media}
            accept="image"
            current={images}
            onUploaded={onUploaded}
            onClose={() => setPicking(false)}
            onPick={(urls) => {
              setImages(urls);
              setPicking(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
