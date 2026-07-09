'use client';

import { useEffect } from 'react';
import { useModeStore } from '@/store/useModeStore';

export default function ModeSync() {
  const mode = useModeStore((state) => state.mode);

  useEffect(() => {
    // Theme variables are scoped to [data-mode] — set it on <html> so the
    // pre-hydration script and React stay in agreement (no flash / mismatch).
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  return null;
}
