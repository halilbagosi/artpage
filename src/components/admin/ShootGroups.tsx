"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { SHOOT_TYPES, type Entry } from "@/lib/schema";
import { api, buttonClass, MediaThumb, sendJson } from "./ui";

const NO_SHOOT = "No shoot";

/** How a shoot's pictures are typed: one type, a mix, or none yet. */
function shootTypeLabel(photos: Entry[]) {
  const types = new Set(photos.map((p) => p.shootType || ""));
  if (types.size > 1) return "Mixed";
  return [...types][0] || "Uncategorised";
}

/**
 * The photography collection, one block per shoot. Pictures can be selected
 * (one by one, or a whole shoot at once) and given a shoot type together.
 */
export default function ShootGroups({
  entries,
  onOpen,
  onSaved,
}: {
  entries: Entry[];
  onOpen: (entry: Entry) => void;
  onSaved: (message: string) => Promise<void>;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shoots = useMemo(() => {
    const groups = new Map<string, Entry[]>();
    for (const entry of entries) {
      const client = entry.client?.trim() || NO_SHOOT;
      if (!groups.has(client)) groups.set(client, []);
      groups.get(client)!.push(entry);
    }
    return [...groups].sort(([a], [b]) =>
      a === NO_SHOOT ? 1 : b === NO_SHOOT ? -1 : a.localeCompare(b)
    );
  }, [entries]);

  if (entries.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-world-hairline py-20 text-center text-sm text-world-muted">
        Nothing here yet — add your first pictures.
      </p>
    );
  }

  const toggle = (slugs: string[], on: boolean) =>
    setSelected((current) => {
      const next = new Set(current);
      for (const slug of slugs) {
        if (on) next.add(slug);
        else next.delete(slug);
      }
      return next;
    });

  const setType = async (shootType: string) => {
    setBusy(true);
    setError(null);
    try {
      const slugs = [...selected];
      await api("/api/admin/entries/photography", sendJson("PATCH", { slugs, set: { shootType } }));
      const what = `${slugs.length} picture${slugs.length > 1 ? "s" : ""}`;
      await onSaved(shootType ? `${what} marked ${shootType}` : `${what} uncategorised`);
      setSelected(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  const selecting = selected.size > 0;

  return (
    <div className="space-y-8 pb-24">
      <div className="-mb-2 flex justify-end">
        <button
          type="button"
          onClick={() =>
            setCollapsed(
              collapsed.size === shoots.length ? new Set() : new Set(shoots.map(([c]) => c))
            )
          }
          className="text-[13px] text-world-muted underline decoration-world-hairline underline-offset-4 transition-colors hover:text-world-ink"
        >
          {collapsed.size === shoots.length ? "Expand all" : "Collapse all"}
        </button>
      </div>

      {shoots.map(([client, photos]) => {
        const slugs = photos.map((p) => p.slug);
        const picked = slugs.filter((s) => selected.has(s)).length;
        const all = picked === slugs.length;
        const type = shootTypeLabel(photos);
        const open = !collapsed.has(client);
        const listId = `shoot-${slugs[0]}`;
        return (
          <section
            key={client}
            aria-label={client}
            className="rounded-2xl border border-world-hairline bg-white/40 px-5 py-3"
          >
            <header className="flex items-center gap-3 py-1">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() =>
                  setCollapsed((current) => {
                    const next = new Set(current);
                    if (open) next.add(client);
                    else next.delete(client);
                    return next;
                  })
                }
                className="-ml-1 flex min-w-0 flex-1 items-center gap-3 rounded-lg px-1 py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-world-accent"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 12 12"
                  className={clsx(
                    "h-3.5 w-3.5 shrink-0 text-world-muted transition-transform duration-300",
                    !open && "-rotate-90"
                  )}
                >
                  <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h2 className="truncate font-serif text-2xl tracking-[-0.01em]">{client}</h2>
                <span className="text-[13px] tabular-nums text-world-muted">{photos.length}</span>
                <span
                  className={clsx(
                    "shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-medium",
                    type === "Uncategorised" || type === "Mixed"
                      ? "border border-dashed border-world-hairline text-world-muted"
                      : "bg-world-surface text-world-ink"
                  )}
                >
                  {type}
                </span>
              </button>
              <button
                type="button"
                onClick={() => toggle(slugs, !all)}
                className={`${buttonClass.secondary} px-3 py-1 text-[13px]`}
              >
                {all
                  ? "Deselect all"
                  : picked
                    ? `Select all photos (${picked}/${slugs.length})`
                    : "Select all photos"}
              </button>
            </header>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={listId}
                  // Padding keeps the selection ring clear of the clip
                  className="-mx-1 overflow-hidden px-1"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                >
                  <ul className="mt-3 grid border-t border-world-hairline pb-2 pt-4 grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {photos.map((entry) => {
                      const isSelected = selected.has(entry.slug);
                      return (
                        <li key={entry.slug} className="group relative min-w-0">
                          <button
                            type="button"
                            onClick={() =>
                              selecting ? toggle([entry.slug], !isSelected) : onOpen(entry)
                            }
                            className="block w-full text-left outline-none"
                          >
                            {entry.image ? (
                              <MediaThumb
                                url={entry.image}
                                kind="image"
                                className={clsx(
                                  "aspect-4/3 rounded-lg ring-offset-2 ring-offset-world-bg transition-transform duration-200 group-active:scale-[0.98] group-focus-visible:ring-2 group-focus-visible:ring-world-accent",
                                  isSelected && "ring-2 ring-world-accent"
                                )}
                              />
                            ) : (
                              <div className="grid aspect-4/3 place-items-center rounded-lg border border-dashed border-world-hairline text-[12px] text-world-muted">
                                No image
                              </div>
                            )}
                            <p className={clsx("mt-2 truncate text-[13px] font-medium", !entry.title && "text-world-muted")}>
                              {entry.title || "Untitled"}
                            </p>
                            <p className="truncate text-[12px] text-world-muted">
                              {[entry.shootType, entry.category].filter(Boolean).join(" · ") || "—"}
                            </p>
                          </button>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggle([entry.slug], e.target.checked)}
                            aria-label={`Select ${entry.title || entry.slug}`}
                            className={clsx(
                              "absolute left-2 top-2 h-5 w-5 cursor-pointer accent-[var(--world-accent)] transition-opacity",
                              isSelected || selecting
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                            )}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        );
      })}

      {/* Bulk actions for the current selection */}
      <AnimatePresence>
        {selecting && (
          <motion.div
            role="toolbar"
            aria-label="Selected pictures"
            className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4 md:left-[240px]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
          >
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-world-hairline bg-world-bg/95 px-4 py-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] backdrop-blur">
              <span className="mr-1 text-sm font-medium tabular-nums">{selected.size} selected</span>
              <span className="text-[13px] text-world-muted">Mark as</span>
              {SHOOT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  disabled={busy}
                  onClick={() => setType(t)}
                  className={`${buttonClass.primary} px-3.5 py-1.5`}
                >
                  {t}
                </button>
              ))}
              <button
                type="button"
                disabled={busy}
                onClick={() => setType("")}
                className={`${buttonClass.secondary} px-3.5 py-1.5`}
              >
                Uncategorised
              </button>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className={`${buttonClass.secondary} border-transparent px-3 py-1.5`}
              >
                Clear
              </button>
              {error && (
                <p role="alert" className="w-full text-sm text-[#b3261e]">
                  {error}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
