'use client';

import { useEffect, useState, ReactNode } from 'react';

/**
 * A safe wrapper around the @samasante/liquid-glass Glass component.
 * 
 * On devices where Glass fails (e.g., mobile Safari without WebGL2),
 * this falls back to a simple div with CSS backdrop-filter, which
 * achieves a similar frosted-glass look without WebGL.
 */

interface SafeGlassProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  optics?: {
    frost?: number;
    strength?: number;
    dispersion?: number;
    sheen?: number;
  };
}

export default function SafeGlass({ children, className = '', style = {}, optics }: SafeGlassProps) {
  const [useRealGlass, setUseRealGlass] = useState(false);
  const [GlassComponent, setGlassComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // Only attempt to load the Glass component on the client
    async function loadGlass() {
      try {
        // Check if WebGL2 is available (required by liquid-glass)
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2');
        if (!gl) {
          console.log('[SafeGlass] WebGL2 not available, using CSS fallback');
          return;
        }

        const mod = await import('@samasante/liquid-glass');
        setGlassComponent(() => mod.Glass);
        setUseRealGlass(true);
      } catch (err) {
        console.log('[SafeGlass] Glass component failed to load, using CSS fallback', err);
      }
    }
    loadGlass();
  }, []);

  const fallbackStyle: React.CSSProperties = {
    ...style,
    backdropFilter: `blur(${optics?.frost ?? 6}px)`,
    WebkitBackdropFilter: `blur(${optics?.frost ?? 6}px)`,
  };

  if (useRealGlass && GlassComponent) {
    return (
      <GlassComponent className={className} style={style} optics={optics}>
        {children}
      </GlassComponent>
    );
  }

  return (
    <div className={className} style={fallbackStyle}>
      {children}
    </div>
  );
}
