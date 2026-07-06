import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { EntityForm } from "@/components/admin/EntityForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteEntity } from "@/lib/admin/actions";
import { getAdminEntity } from "@/lib/admin/registry";
import { ThemeMaterialsPanel } from "@/components/admin/ThemeMaterialsPanel";

type PageProps = {
  params: Promise<{ entity: string; id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EntityEditPage({ params, searchParams }: PageProps) {
  const { entity: entitySlug, id: rawId } = await params;
  const { error } = await searchParams;
  const entity = getAdminEntity(entitySlug);
  if (!entity) notFound();

  const id = decodeURIComponent(rawId);
  const idValue = entity.idIsNumber ? Number(id) : id;
  if (entity.idIsNumber && Number.isNaN(idValue)) notFound();

  const delegate = (
    prisma as unknown as Record<
      string,
      { findUnique: (args: object) => Promise<Record<string, unknown> | null> }
    >
  )[entity.model];
  const record = await delegate.findUnique({
    where: { [entity.idField]: idValue },
  });
  if (!record) notFound();

  const deleteAction = deleteEntity.bind(null, entity.slug, id);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/admin/${entity.slug}`}
        className="text-sm text-wood-muted hover:text-wood"
      >
        ← 回到{entity.label}列表
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-medium">
          編輯{entity.label}：{id}
        </h1>
        <DeleteButton action={deleteAction} />
      </div>

      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 rounded-2xl border border-border-card bg-paper-card p-6 shadow-[var(--shadow-paper)]">
        <EntityForm entity={entity} record={record} id={id} />
      </div>

      {entity.slug === "themes" ? <ThemeMaterialsPanel themeSlug={id} /> : null}
    </div>
  );
}
