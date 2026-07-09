'use client';

import { useModeStore, PortfolioMode } from '@/store/useModeStore';
import { motion } from 'framer-motion';
import SafeGlass from '@/components/SafeGlass';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const { mode, setMode } = useModeStore();
  const router = useRouter();
  const pathname = usePathname();

  const modes: { id: PortfolioMode; label: string }[] = [
    { id: 'painting', label: 'Painting' },
    { id: 'photography', label: 'Photography' },
    { id: 'videography', label: 'Videography' },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <SafeGlass
      className="fixed top-0 left-0 w-full z-[100] pointer-events-auto transition-colors duration-500"
      style={{ background: 'var(--bg-primary-glass, rgba(253,251,247,0.6))' }}
      optics={{ frost: 6, strength: 0.02, dispersion: 0.15, sheen: 0.2 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center text-text-primary px-4 py-2 md:p-6 w-full">
        <div className="flex justify-between items-center w-full md:w-auto">
          <a href="/" className="font-serif text-base md:text-xl tracking-wider font-semibold hover:opacity-80 transition-opacity">
            HALIL BAGOSI
          </a>
          
          <button 
            className="md:hidden flex items-center justify-center p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        <div 
          className={`w-full md:w-auto overflow-hidden md:!max-h-none md:!opacity-100 flex flex-col md:flex-row items-center mt-4 md:mt-0 transition-all duration-500 ease-in-out ${
            isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs md:text-sm uppercase tracking-widest font-sans w-full md:w-auto">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMode(m.id);
                  setIsMenuOpen(false);
                  // Client-side navigation keeps the persisted mode intact
                  // (a full reload used to reset it back to Painting).
                  if (pathname !== '/') {
                    router.push('/');
                  }
                }}
                className="relative pb-1 transition-colors hover:opacity-80"
              >
                <span className={mode === m.id ? 'opacity-100' : 'opacity-50'}>
                  {m.label}
                </span>
                {mode === m.id && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute left-0 bottom-0 w-full h-[1px] bg-text-primary hidden md:block"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-xs md:text-sm uppercase tracking-widest font-sans w-full md:w-auto md:pl-6 md:border-l border-text-primary/20 pt-4 md:pt-0 border-t md:border-t-0 mb-3 md:mb-0 mt-4 md:mt-0">
            <a href="/about" onClick={() => setIsMenuOpen(false)} className="hover:opacity-80 transition-opacity">About</a>
            <a href="/contact" onClick={() => setIsMenuOpen(false)} className="hover:opacity-80 transition-opacity">Contact</a>
          </div>
        </div>
      </div>
    </SafeGlass>
  );
}
