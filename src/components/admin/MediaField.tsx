"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { MediaFile, MediaKind } from "@/lib/schema";
import MediaPicker from "./MediaPicker";
import { buttonClass, MediaThumb } from "./ui";

/** Form control holding a /media/… URL, chosen through the library picker. */
export default function MediaField({
  value,
  accept,
  required,
  media,
  onChange,
  onUploaded,
}: {
  value: string;
  accept: MediaKind;
  required?: boolean;
  media: MediaFile[];
  onChange: (url: string) => void;
  onUploaded: () => Promise<void>;
}) {
  const [picking, setPicking] = useState(false);

  return (
    <div className="flex items-center gap-4 rounded-lg border border-world-hairline bg-white/70 p-2.5">
      {value ? (
        <MediaThumb url={value} kind={accept} className="h-16 w-20 shrink-0 rounded-md" sizes="80px" />
      ) : (
        <div className="grid h-16 w-20 shrink-0 place-items-center rounded-md border border-dashed border-world-hairline text-[11px] text-world-muted">
          None
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">
          {value ? value.replace("/media/", "") : `No ${accept} chosen`}
        </p>
        <div className="mt-1.5 flex gap-1">
          <button
            type="button"
            className={`${buttonClass.secondary} px-3 py-1 text-[13px]`}
            onClick={() => setPicking(true)}
          >
            {value ? "Change…" : "Choose…"}
          </button>
          {value && !required && (
            <button
              type="button"
              className={`${buttonClass.danger} px-3 py-1 text-[13px]`}
              onClick={() => onChange("")}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {picking && (
          <MediaPicker
            media={media}
            accept={accept}
            current={value}
            onUploaded={onUploaded}
            onClose={() => setPicking(false)}
            onPick={(url) => {
              onChange(url);
              setPicking(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
