import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { logout } from "@/lib/admin/actions";
import { adminEntities } from "@/lib/admin/registry";

export const dynamic = "force-dynamic";

export const metadata = { title: "湯湯屋後台" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-paper text-wood">
      {/* 側欄 */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border-paper bg-paper-section px-4 py-6 sm:flex">
        <Link href="/admin" className="flex items-center gap-2 px-2 font-heading text-lg font-medium">
          🍲 湯湯屋後台
        </Link>
        <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="後台選單">
          {adminEntities.map((e) => (
            <Link
              key={e.slug}
              href={`/admin/${e.slug}`}
              className="rounded-xl px-3 py-2 text-sm transition-colors hover:bg-moss-pale"
            >
              {e.icon} {e.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 space-y-2 border-t border-border-paper pt-4">
          <Link
            href="/"
            className="block rounded-xl px-3 py-2 text-sm text-wood-muted transition-colors hover:bg-moss-pale"
          >
            ← 回到網站
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-xl px-3 py-2 text-left text-sm text-wood-muted transition-colors hover:bg-moss-pale"
            >
              登出
            </button>
          </form>
        </div>
      </aside>

      {/* 手機頂欄 + 內容 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border-paper bg-paper-section px-4 py-3 sm:hidden">
          <Link href="/admin" className="font-heading text-base font-medium">
            🍲 湯湯屋後台
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm text-wood-muted">
              登出
            </button>
          </form>
        </header>
        <nav
          className="flex gap-2 overflow-x-auto border-b border-border-paper bg-paper-section px-4 py-2 sm:hidden"
          aria-label="後台選單"
        >
          {adminEntities.map((e) => (
            <Link
              key={e.slug}
              href={`/admin/${e.slug}`}
              className="shrink-0 rounded-full border border-border-card px-3 py-1 text-xs"
            >
              {e.icon} {e.label}
            </Link>
          ))}
        </nav>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
