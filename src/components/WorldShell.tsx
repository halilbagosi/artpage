"use client";

import { Fragment, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV = [
  { href: "/art", label: "Art" },
  { href: "/photography", label: "Photo" },
  { href: "/film", label: "Film" },
  { href: "/about", label: "About" },
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
      <header className="fixed inset-x-0 top-0 z-40 border-b border-world-hairline bg-[color-mix(in_srgb,var(--world-bg)_75%,transparent)] backdrop-blur-xl">
        <div className="flex items-center justify-between px-5 py-3 md:px-10 md:py-4">
          <Link
            href="/"
            aria-label="Back to the gateway"
            className="font-serif text-xl tracking-tight text-world-ink transition-opacity hover:opacity-60"
          >
            HB<span className="text-world-accent">.</span>
          </Link>
          <nav className="flex items-center gap-4 md:gap-7">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Fragment key={item.href}>
                  {item.href === "/about" && (
                    <span aria-hidden className="h-3 w-px bg-world-hairline" />
                  )}
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "relative py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors md:text-[11px]",
                      active
                        ? "text-world-ink"
                        : "text-world-muted hover:text-world-ink"
                    )}
                  >
                    {item.label}
                    {/* Out of flow, so every item shares one baseline */}
                    <span
                      className={clsx(
                        "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-world-accent transition-transform duration-300",
                        active ? "scale-x-100" : "scale-x-0"
                      )}
                    />
                  </Link>
                </Fragment>
              );
            })}
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t border-world-hairline px-5 py-8 md:px-10">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <span className="font-serif text-lg">Halil Bagosi</span>
          <span className="type-label text-world-muted">
            Art · Photography · Film — {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}
