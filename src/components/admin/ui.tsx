"use client";

import Image from "next/image";
import clsx from "clsx";
import type { MediaFile } from "@/lib/schema";

/** Shared look for the dashboard: plain, legible controls on the ivory theme. */
export const inputClass =
  "w-full rounded-lg border border-world-hairline bg-white/70 px-3 py-2 text-[15px] text-world-ink outline-none transition-[border-color,box-shadow] placeholder:text-world-muted/70 focus:border-world-accent focus:ring-2 focus:ring-world-accent/20";

export const buttonClass = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-world-ink px-4 py-2 text-sm font-medium text-world-bg transition-[transform,opacity] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-full border border-world-hairline px-4 py-2 text-sm font-medium text-world-ink transition-[transform,background-color] hover:bg-world-surface active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[#b3261e] transition-[transform,background-color] hover:bg-[#b3261e]/8 active:scale-[0.97]",
};

export async function api<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    let message = res.statusText;
    try {
      message = (await res.json()).error ?? message;
    } catch {
      // Body wasn't JSON — keep the status text
    }
    throw new Error(message);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export function sendJson(method: "POST" | "PUT" | "PATCH", body: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export async function uploadFiles(files: FileList | File[]): Promise<MediaFile[]> {
  const form = new FormData();
  for (const file of Array.from(files)) form.append("file", file);
  const { files: saved } = await api<{ files: MediaFile[] }>("/api/admin/media", {
    method: "POST",
    body: form,
  });
  return saved;
}

export function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Thumbnail for a library file; videos show their first frame. */
export function MediaThumb({
  url,
  kind,
  className,
  sizes = "240px",
}: {
  url: string;
  kind: MediaFile["kind"];
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={clsx("relative overflow-hidden bg-world-surface", className)}>
      {kind === "video" ? (
        <video
          src={`${url}#t=0.1`}
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image src={url} alt="" fill sizes={sizes} className="object-cover" />
      )}
    </div>
  );
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-[13px] font-medium text-world-ink/80">
        {label}
      </label>
      {children}
      {hint && <p className="text-[12px] text-world-muted">{hint}</p>}
    </div>
  );
}
