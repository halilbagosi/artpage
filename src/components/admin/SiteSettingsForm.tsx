"use client";

import { useState } from "react";
import { WORLD_KEYS, type MediaFile, type SiteSettings, type WorldKey } from "@/lib/schema";
import MediaField from "./MediaField";
import { api, buttonClass, Field, inputClass, sendJson } from "./ui";

const WORLD_NAMES: Record<WorldKey, string> = {
  art: "I — The Atelier",
  photography: "II — The Darkroom",
  film: "III — The Screening Room",
};

export default function SiteSettingsForm({
  site,
  media,
  onSaved,
  onUploaded,
}: {
  site: SiteSettings;
  media: MediaFile[];
  onSaved: (message: string) => Promise<void>;
  onUploaded: () => Promise<void>;
}) {
  const [values, setValues] = useState<SiteSettings>(site);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dirty = JSON.stringify(values) !== JSON.stringify(site);

  const setWorld = (key: WorldKey, patch: Partial<SiteSettings["worlds"][WorldKey]>) =>
    setValues((v) => ({
      ...v,
      worlds: { ...v.worlds, [key]: { ...v.worlds[key], ...patch } },
    }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/api/admin/site", sendJson("PUT", values));
      await onSaved("Site settings saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="max-w-2xl">
      <section className="space-y-5">
        <h2 className="type-label text-world-muted">About you</h2>
        <Field label="Email" htmlFor="email" hint="Used for every contact link on the site">
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field
          label="Photographing since"
          htmlFor="since"
          hint="Years of experience on the Photography and About pages are counted from this year"
        >
          <input
            id="since"
            type="number"
            min={1900}
            max={new Date().getFullYear()}
            value={values.photographySince}
            onChange={(e) =>
              setValues({ ...values, photographySince: Number(e.target.value) })
            }
            className={`${inputClass} max-w-32 tabular-nums`}
          />
        </Field>
        <Field label="Portrait" hint="Shown on the About page">
          <MediaField
            value={values.portrait}
            accept="image"
            media={media}
            onUploaded={onUploaded}
            onChange={(portrait) => setValues({ ...values, portrait })}
          />
        </Field>
        <Field label="Bio" htmlFor="bio" hint="Leave a blank line between paragraphs">
          <textarea
            id="bio"
            rows={8}
            value={values.bio}
            onChange={(e) => setValues({ ...values, bio: e.target.value })}
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </Field>
      </section>

      {WORLD_KEYS.map((key) => (
        <section key={key} className="mt-12 space-y-5 border-t border-world-hairline pt-8">
          <h2 className="type-label text-world-muted">{WORLD_NAMES[key]}</h2>
          <Field label="Homepage cover" hint="This world's panel on the homepage">
            <MediaField
              value={values.worlds[key].cover}
              accept="image"
              media={media}
              onUploaded={onUploaded}
              onChange={(cover) => setWorld(key, { cover })}
            />
          </Field>
          <Field label="Introduction" htmlFor={`blurb-${key}`} hint="The paragraph under the page title">
            <textarea
              id={`blurb-${key}`}
              rows={3}
              value={values.worlds[key].blurb}
              onChange={(e) => setWorld(key, { blurb: e.target.value })}
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </Field>
        </section>
      ))}

      {/* Save bar stays in reach on a long form */}
      <div className="sticky bottom-0 mt-10 flex items-center gap-4 border-t border-world-hairline bg-world-bg/90 py-4 backdrop-blur">
        <button type="submit" className={buttonClass.primary} disabled={busy || !dirty}>
          {busy ? "Saving…" : "Save settings"}
        </button>
        {dirty && !busy && (
          <button type="button" className={buttonClass.secondary} onClick={() => setValues(site)}>
            Revert
          </button>
        )}
        {error && (
          <p role="alert" className="text-sm text-[#b3261e]">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
