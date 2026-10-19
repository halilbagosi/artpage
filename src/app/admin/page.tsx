import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminEnabled, readAll } from "@/lib/admin";
import Dashboard from "@/components/admin/Dashboard";
import { ADMIN_SECTIONS, type AdminSection } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/** Local content dashboard — only exists under `npm run admin`. */
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  if (!adminEnabled()) notFound();
  const { section } = await searchParams;
  const initialSection = ADMIN_SECTIONS.includes(section as AdminSection)
    ? (section as AdminSection)
    : "site";

  return (
    <div data-world="about">
      <Dashboard initial={readAll()} initialSection={initialSection} />
    </div>
  );
}
