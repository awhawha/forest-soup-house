import Link from "next/link";
import { notFound } from "next/navigation";
import { EntityForm } from "@/components/admin/EntityForm";
import { getAdminEntity } from "@/lib/admin/registry";

type PageProps = {
  params: Promise<{ entity: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EntityNewPage({ params, searchParams }: PageProps) {
  const { entity: entitySlug } = await params;
  const { error } = await searchParams;
  const entity = getAdminEntity(entitySlug);
  if (!entity) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/admin/${entity.slug}`}
        className="text-sm text-wood-muted hover:text-wood"
      >
        ← 回到{entity.label}列表
      </Link>
      <h1 className="mt-2 font-heading text-2xl font-medium">
        新增{entity.label}
      </h1>

      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 rounded-2xl border border-border-card bg-paper-card p-6 shadow-[var(--shadow-paper)]">
        <EntityForm entity={entity} record={null} id={null} />
      </div>
    </div>
  );
}
