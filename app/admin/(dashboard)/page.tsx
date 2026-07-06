import Link from "next/link";
import { prisma } from "@/lib/db";
import { adminEntities } from "@/lib/admin/registry";

export default async function AdminDashboardPage() {
  const counts = await Promise.all(
    adminEntities.map(async (e) => {
      const delegate = (
        prisma as unknown as Record<string, { count: () => Promise<number> }>
      )[e.model];
      return { entity: e, count: await delegate.count() };
    }),
  );

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-heading text-2xl font-medium">內容總覽</h1>
      <p className="mt-1 text-sm text-wood-muted">
        點進各分類即可新增、編輯或刪除內容，前台頁面會立即更新。
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {counts.map(({ entity, count }) => (
          <Link
            key={entity.slug}
            href={`/admin/${entity.slug}`}
            className="rounded-2xl border border-border-card bg-paper-card p-5 shadow-[var(--shadow-paper)] transition-transform hover:-translate-y-0.5"
          >
            <p className="text-2xl" aria-hidden>
              {entity.icon}
            </p>
            <p className="mt-2 font-heading text-lg font-medium">{entity.label}</p>
            <p className="mt-1 text-sm text-wood-muted">{count} 筆資料</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
