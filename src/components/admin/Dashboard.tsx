"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import type { DashboardData } from "@/lib/admin";
import {
  ADMIN_SECTIONS as SECTIONS,
  COLLECTIONS,
  type AdminSection,
  type CollectionKey,
  type Entry,
} from "@/lib/schema";
import BulkPhotoSheet from "./BulkPhotoSheet";
import EntrySheet from "./EntrySheet";
import MediaLibrary from "./MediaLibrary";
import ShootGroups from "./ShootGroups";
import SiteSettingsForm from "./SiteSettingsForm";
import { api, buttonClass, MediaThumb } from "./ui";

type Section = AdminSection;

function sectionLabel(section: Section) {
  if (section === "site") return "Site settings";
  if (section === "media") return "Media library";
  return COLLECTIONS[section].label;
}

function entryMeta(collection: CollectionKey, entry: Entry) {
  if (collection === "paintings") {
    return [entry.medium, [entry.month, entry.year].filter(Boolean).join(" ")]
      .filter(Boolean)
      .join(" · ");
  }
  if (collection === "photography") return entry.client || "No shoot";
  return [entry.role, entry.year].filter(Boolean).join(" · ");
}

export default function Dashboard({
  initial,
  initialSection,
}: {
  initial: DashboardData;
  initialSection: Section;
}) {
  const [data, setData] = useState(initial);
  const [section, setSection] = useState<Section>(initialSection);
  const [editing, setEditing] = useState<{ entry: Entry | null } | null>(null);
  const [bulk, setBulk] = useState(false);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Mirror the theme onto <html> so overscroll matches
  useEffect(() => {
    document.documentElement.setAttribute("data-world", "about");
    return () => document.documentElement.removeAttribute("data-world");
  }, []);

  const go = (next: Section) => {
    setSection(next);
    setEditing(null);
    setBulk(false);
    history.replaceState(null, "", `?section=${next}`);
  };

  const refresh = useCallback(async () => {
    setData(await api<DashboardData>("/api/admin/content"));
  }, []);

  const notify = useCallback(
    async (text: string) => {
      await refresh();
      clearTimeout(toastTimer.current);
      setToast({ id: Date.now(), text });
      toastTimer.current = setTimeout(() => setToast(null), 2600);
    },
    [refresh]
  );

  const count = (s: Section) =>
    s === "site" ? null : s === "media" ? data.media.length : data.entries[s].length;

  return (
    <div className="min-h-screen bg-world-bg text-world-ink md:grid md:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="border-b border-world-hairline md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-b-0 md:border-r">
        <div className="flex items-baseline gap-3 px-5 pb-3 pt-5 md:px-6 md:pb-6 md:pt-7">
          <span className="font-serif text-xl tracking-tight">
            HB<span className="text-world-accent">.</span>
          </span>
          <span className="type-label text-world-muted">Dashboard</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:px-3 md:pb-0">
          {SECTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => go(s)}
              aria-current={section === s ? "page" : undefined}
              className={clsx(
                "flex shrink-0 items-center justify-between gap-6 rounded-lg px-3 py-2 text-left text-[14px] transition-colors",
                section === s
                  ? "bg-world-surface font-medium text-world-ink"
                  : "text-world-ink/70 hover:bg-world-surface/60 hover:text-world-ink"
              )}
            >
              {sectionLabel(s)}
              {count(s) !== null && (
                <span className="tabular-nums text-[12px] text-world-muted">{count(s)}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto hidden space-y-3 px-6 pb-7 text-[12px] leading-relaxed text-world-muted md:block">
          <p>
            Changes save straight to <code>content/</code> and{" "}
            <code>public/media</code>. Commit and push to publish them.
          </p>
          <a href="/" target="_blank" rel="noreferrer" className="inline-block text-world-ink underline decoration-world-hairline underline-offset-4 hover:decoration-world-accent">
            View site ↗
          </a>
        </div>
      </aside>

      {/* Content */}
      <main className="min-w-0 px-5 py-8 md:px-12 md:py-12">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div>
            {section !== "site" && section !== "media" && (
              <p className="type-label text-world-muted">{COLLECTIONS[section].room}</p>
            )}
            <h1 className="mt-1 font-serif text-4xl tracking-[-0.02em] md:text-5xl">
              {sectionLabel(section)}
            </h1>
          </div>
          {section !== "site" && section !== "media" && (
            <div className="flex gap-2">
              <a href={COLLECTIONS[section].href} target="_blank" rel="noreferrer" className={buttonClass.secondary}>
                View page ↗
              </a>
              {section === "photography" ? (
                <button type="button" className={buttonClass.primary} onClick={() => setBulk(true)}>
                  Add pictures
                </button>
              ) : (
                <button type="button" className={buttonClass.primary} onClick={() => setEditing({ entry: null })}>
                  New {COLLECTIONS[section].singular}
                </button>
              )}
            </div>
          )}
        </header>

        {section === "site" && (
          <SiteSettingsForm
            key={JSON.stringify(data.site)}
            site={data.site}
            media={data.media}
            onSaved={notify}
            onUploaded={refresh}
          />
        )}

        {section === "media" && (
          <MediaLibrary media={data.media} usage={data.usage} onChanged={notify} />
        )}

        {section === "photography" && (
          <ShootGroups
            entries={data.entries.photography}
            onOpen={(entry) => setEditing({ entry })}
            onSaved={notify}
          />
        )}

        {section !== "site" && section !== "media" && section !== "photography" && (
          <CollectionGrid
            collection={section}
            entries={data.entries[section]}
            onOpen={(entry) => setEditing({ entry })}
          />
        )}
      </main>

      <AnimatePresence>
        {editing && section !== "site" && section !== "media" && (
          <EntrySheet
            key={editing.entry?.slug ?? "new"}
            collection={section}
            entry={editing.entry}
            media={data.media}
            onClose={() => setEditing(null)}
            onSaved={notify}
            onUploaded={refresh}
          />
        )}
        {bulk && section === "photography" && (
          <BulkPhotoSheet
            key="bulk"
            entries={data.entries.photography}
            media={data.media}
            onClose={() => setBulk(false)}
            onSaved={notify}
            onUploaded={refresh}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center">
        <AnimatePresence>
          {toast && (
            <motion.p
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="rounded-full bg-world-ink px-4 py-2 text-sm text-world-bg shadow-lg"
            >
              {toast.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CollectionGrid({
  collection,
  entries,
  onOpen,
}: {
  collection: CollectionKey;
  entries: Entry[];
  onOpen: (entry: Entry) => void;
}) {
  const mediaKey = COLLECTIONS[collection].mediaKey;

  if (entries.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-world-hairline py-20 text-center text-sm text-world-muted">
        Nothing here yet — add your first {COLLECTIONS[collection].singular}.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {entries.map((entry) => (
        <li key={entry.slug} className="min-w-0">
          <button
            type="button"
            onClick={() => onOpen(entry)}
            className="group block w-full text-left outline-none"
          >
            {entry[mediaKey] ? (
              <MediaThumb
                url={entry[mediaKey]}
                kind="image"
                className="aspect-4/3 rounded-lg transition-transform duration-200 group-hover:shadow-[0_12px_30px_-14px_rgba(0,0,0,0.35)] group-active:scale-[0.98] group-focus-visible:ring-2 group-focus-visible:ring-world-accent"
              />
            ) : (
              <div className="grid aspect-4/3 place-items-center rounded-lg border border-dashed border-world-hairline text-[12px] text-world-muted">
                No image
              </div>
            )}
            <p className={clsx("mt-2.5 truncate text-[14px] font-medium", !entry.title && "text-world-muted")}>
              {entry.title || "Untitled"}
            </p>
            <p className="truncate text-[12px] text-world-muted">
              {entryMeta(collection, entry) || "—"}
              {entry.sample === "true" && " · Sample"}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}
