import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAdminEntity } from "@/lib/admin/registry";

type PageProps = {
  params: Promise<{ entity: string }>;
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
};

export default async function EntityListPage({ params, searchParams }: PageProps) {
  const { entity: entitySlug } = await params;
  const { saved, deleted, error } = await searchParams;
  const entity = getAdminEntity(entitySlug);
  if (!entity) notFound();

  const delegate = (
    prisma as unknown as Record<
      string,
      { findMany: (args: object) => Promise<Record<string, unknown>[]> }
    >
  )[entity.model];
  const rows = await delegate.findMany({
    orderBy:
      entity.slug === "theme-books"
        ? [{ themeSlug: "asc" }, { sortOrder: "asc" }]
        : entity.slug === "ingredients"
          ? { name: "asc" }
          : entity.slug === "ambient-texts"
            ? [{ kind: "asc" }, { sortOrder: "asc" }]
            : entity.slug === "themes"
              ? [{ weekNumber: "asc" }, { sortOrder: "asc" }]
              : { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-medium">
            {entity.icon} {entity.label}
          </h1>
          {entity.description ? (
            <p className="mt-1 text-sm text-wood-muted">{entity.description}</p>
          ) : null}
        </div>
        <Link
          href={`/admin/${entity.slug}/new`}
          className="rounded-xl bg-moss px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-moss-hover"
        >
          ＋ 新增
        </Link>
      </div>

      {saved ? (
        <p className="mt-4 rounded-xl bg-moss-pale px-4 py-2.5 text-sm text-moss" role="status">
          已儲存 ✓
        </p>
      ) : null}
      {deleted ? (
        <p className="mt-4 rounded-xl bg-moss-pale px-4 py-2.5 text-sm text-moss" role="status">
          已刪除 ✓
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border-card bg-paper-card shadow-[var(--shadow-paper)]">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-border-paper text-xs uppercase tracking-wide text-wood-muted">
              {entity.listFields.map((f) => (
                <th key={f.name} className="px-4 py-3 font-medium">
                  {f.label}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={entity.listFields.length + 1}
                  className="px-4 py-8 text-center text-wood-muted"
                >
                  還沒有資料，按右上角「＋ 新增」開始。
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const id = String(row[entity.idField]);
                return (
                  <tr key={id} className="border-b border-border-paper/60 last:border-b-0">
                    {entity.listFields.map((f) => (
                      <td key={f.name} className="max-w-[18rem] truncate px-4 py-3">
                        {row[f.name] == null ? "—" : String(row[f.name])}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/${entity.slug}/${encodeURIComponent(id)}`}
                        className="text-sm font-medium text-moss hover:underline"
                      >
                        編輯
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
