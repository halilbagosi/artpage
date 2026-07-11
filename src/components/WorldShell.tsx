"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const SWITCHER = [
  { href: "/art", label: "Art" },
  { href: "/photography", label: "Photo" },
  { href: "/film", label: "Film" },
];

/**
 * Wraps a world page: scopes the world's CSS variables, mirrors the world
 * onto <html> so the body background matches during overscroll, and renders
 * the fixed monogram + world-switcher header.
 */
export default function WorldShell({
  world,
  children,
}: {
  world: "art" | "photography" | "film" | "about";
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.setAttribute("data-world", world);
    return () => {
      document.documentElement.removeAttribute("data-world");
    };
  }, [world]);

  return (
    <div data-world={world} className="min-h-screen bg-world-bg text-world-ink">
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="flex items-center justify-between px-5 py-4 md:px-10">
          <Link
            href="/"
            aria-label="Back to the gateway"
            className="font-serif text-xl tracking-tight text-world-ink transition-opacity hover:opacity-60"
          >
            HB<span className="text-world-accent">.</span>
          </Link>
          <nav className="flex items-center gap-5 md:gap-7">
            {SWITCHER.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "font-mono text-[11px] uppercase tracking-[0.25em] transition-opacity",
                    active
                      ? "text-world-ink"
                      : "text-world-muted hover:text-world-ink"
                  )}
                >
                  {item.label}
                  <span
                    className={clsx(
                      "mt-1 block h-px bg-world-accent transition-transform origin-left",
                      active ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </Link>
              );
            })}
            <Link
              href="/about"
              className={clsx(
                "font-mono text-[11px] uppercase tracking-[0.25em] transition-opacity",
                pathname === "/about"
                  ? "text-world-ink"
                  : "text-world-muted hover:text-world-ink"
              )}
            >
              About
            </Link>
          </nav>
        </div>
        <div className="h-px bg-world-hairline" />
      </header>

      {children}

      <footer className="border-t border-world-hairline px-5 py-8 md:px-10">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <span className="font-serif text-lg">Halil Bagosi</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-world-muted">
            Art · Photography · Film — {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}
