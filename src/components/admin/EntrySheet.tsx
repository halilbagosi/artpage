"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  COLLECTIONS,
  fieldsOf,
  type CollectionKey,
  type Entry,
  type MediaFile,
} from "@/lib/schema";
import MediaField from "./MediaField";
import { api, buttonClass, Field, inputClass, sendJson } from "./ui";

const SPRING = { type: "spring", bounce: 0, duration: 0.4 } as const;

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

type Values = Record<string, string | boolean>;

function initialValues(collection: CollectionKey, entry: Entry | null): Values {
  const values: Values = {};
  for (const field of fieldsOf(collection)) {
    const raw = entry?.[field.key] ?? "";
    values[field.key] = field.type === "boolean" ? raw === "true" : raw;
  }
  return values;
}

/** Side sheet for creating or editing one entry; enters and leaves on the right. */
export default function EntrySheet({
  collection,
  entry,
  media,
  onClose,
  onSaved,
  onUploaded,
}: {
  collection: CollectionKey;
  /** null = new entry */
  entry: Entry | null;
  media: MediaFile[];
  onClose: () => void;
  onSaved: (message: string) => Promise<void>;
  onUploaded: () => Promise<void>;
}) {
  const config = COLLECTIONS[collection];
  const fields = fieldsOf(collection);
  const start = useMemo(() => initialValues(collection, entry), [collection, entry]);
  const [values, setValues] = useState<Values>(start);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstInput = useRef<HTMLInputElement>(null);
  const dirty = JSON.stringify(values) !== JSON.stringify(start);

  const requestClose = () => {
    if (!dirty || window.confirm("Discard your unsaved changes?")) onClose();
  };

  useEffect(() => {
    firstInput.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const set = (key: string, value: string | boolean) =>
    setValues((v) => ({ ...v, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (entry) {
        await api(
          `/api/admin/entries/${collection}/${encodeURIComponent(entry.slug)}`,
          sendJson("PUT", values)
        );
      } else {
        await api(`/api/admin/entries/${collection}`, sendJson("POST", values));
      }
      await onSaved(values.title ? `“${values.title}” saved` : `${capitalize(config.singular)} saved`);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!entry) return;
    const ok = window.confirm(
      `Delete “${entry.title || entry.slug}”? This removes its file from content/${collection}. The media file stays in the library.`
    );
    if (!ok) return;
    setBusy(true);
    try {
      await api(
        `/api/admin/entries/${collection}/${encodeURIComponent(entry.slug)}`,
        { method: "DELETE" }
      );
      await onSaved(`“${entry.title || entry.slug}” deleted`);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete");
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
        aria-label={entry ? `Edit ${entry.title || config.singular}` : `New ${config.singular}`}
        onSubmit={save}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-world-bg shadow-[-30px_0_80px_-30px_rgba(0,0,0,0.35)]"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={SPRING}
      >
        <header className="flex items-center justify-between gap-4 border-b border-world-hairline px-6 py-4">
          <div className="min-w-0">
            <p className="type-label text-world-muted">{config.room}</p>
            <h2 className="mt-1 truncate font-serif text-2xl tracking-[-0.01em]">
              {entry ? entry.title || "Untitled" : `New ${config.singular}`}
            </h2>
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
          {fields.map((field, i) => {
            const id = `field-${field.key}`;
            const value = values[field.key];
            if (field.type === "boolean") {
              return (
                <label key={field.key} className="flex items-center gap-3 text-[15px]">
                  <input
                    type="checkbox"
                    checked={value === true}
                    onChange={(e) => set(field.key, e.target.checked)}
                    className="h-4 w-4 accent-[var(--world-accent)]"
                  />
                  {field.label}
                </label>
              );
            }
            return (
              <Field
                key={field.key}
                label={field.required ? `${field.label} *` : field.label}
                hint={field.hint}
                htmlFor={field.type === "media" ? undefined : id}
              >
                {field.type === "media" ? (
                  <MediaField
                    value={String(value)}
                    accept={field.accept ?? "image"}
                    required={field.required}
                    media={media}
                    onUploaded={onUploaded}
                    onChange={(url) => set(field.key, url)}
                  />
                ) : field.type === "textarea" ? (
                  <textarea
                    id={id}
                    rows={4}
                    value={String(value)}
                    onChange={(e) => set(field.key, e.target.value)}
                    className={`${inputClass} resize-y`}
                  />
                ) : field.type === "select" ? (
                  <select
                    id={id}
                    value={String(value)}
                    onChange={(e) => set(field.key, e.target.value)}
                    className={inputClass}
                  >
                    <option value="">—</option>
                    {field.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={id}
                    ref={i === 0 ? firstInput : undefined}
                    type={field.type === "url" ? "url" : "text"}
                    placeholder={field.type === "url" ? "https://vimeo.com/…" : undefined}
                    required={field.required}
                    value={String(value)}
                    onChange={(e) => set(field.key, e.target.value)}
                    className={inputClass}
                  />
                )}
              </Field>
            );
          })}
        </div>

        <footer className="border-t border-world-hairline px-6 py-4">
          {error && (
            <p role="alert" className="mb-3 text-sm text-[#b3261e]">
              {error}
            </p>
          )}
          <div className="flex items-center gap-2">
            {entry && (
              <button type="button" className={buttonClass.danger} onClick={remove} disabled={busy}>
                Delete
              </button>
            )}
            <div className="ml-auto flex gap-2">
              <button type="button" className={buttonClass.secondary} onClick={requestClose}>
                Cancel
              </button>
              <button type="submit" className={buttonClass.primary} disabled={busy || (!!entry && !dirty)}>
                {busy ? "Saving…" : entry ? "Save changes" : `Add ${config.singular}`}
              </button>
            </div>
          </div>
        </footer>
      </motion.form>
    </>
  );
}
