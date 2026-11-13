import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[70vh]">
      <div className="border-b border-line bg-raised">
        <div className="mx-auto flex min-h-11 max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-8">
          <p className="font-mono text-[12px] tracking-wider text-muted">
            <span className="text-accent">■</span> calc_admin
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="link-nav font-mono text-[12px]"
            >
              view site ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="link-nav font-mono text-[12px]"
              >
                sign out
              </button>
            </form>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
