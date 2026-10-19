import clsx from "clsx";

/**
 * Fade-and-rise scroll reveal, implemented with CSS scroll-driven animations
 * (see `.reveal` in globals.css). Progressive enhancement: browsers without
 * `animation-timeline: view()` simply show the content.
 */
export default function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx("reveal", className)}>{children}</div>;
}
