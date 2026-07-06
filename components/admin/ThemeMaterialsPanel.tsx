import Link from "next/link";
import { prisma } from "@/lib/db";

/**
 * 主題包編輯頁的「本主題三樣材料」清單 — 一眼看到這碗湯用哪些材料，
 * 各自可跳到材料編輯頁。材料本身仍在「主題材料」分頁完整管理。
 */
export async function ThemeMaterialsPanel({ themeSlug }: { themeSlug: string }) {
  const ingredients = await prisma.themeIngredient.findMany({
    where: { themeSlug },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mt-6 rounded-2xl border border-border-card bg-paper-card p-6 shadow-[var(--shadow-paper)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-lg font-medium">
          🌿 這碗湯的材料（{ingredients.length}）
        </h2>
        <Link
          href="/admin/theme-ingredients/new"
          className="rounded-xl border border-border-card px-4 py-2 text-sm text-wood transition-colors hover:bg-paper-section"
        >
          ＋ 新增材料
        </Link>
      </div>

      {ingredients.length === 0 ? (
        <p className="mt-4 text-sm text-wood-muted">
          這個主題包還沒有材料。按「＋ 新增材料」建立，並在表單裡把「所屬主題包」選成這個主題。
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border-paper/60">
          {ingredients.map((ing) => (
            <li key={ing.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-wood">
                  {ing.glyph ? `${ing.glyph}　` : ""}
                  {ing.name}
                </p>
                <p className="truncate text-xs text-wood-muted">
                  採集地點：{ing.locationName}
                  {ing.scent ? ` · ${ing.scent}` : ""}
                </p>
              </div>
              <Link
                href={`/admin/theme-ingredients/${ing.id}`}
                className="shrink-0 text-sm font-medium text-moss hover:underline"
              >
                編輯
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs leading-relaxed text-wood-muted">
        提示：一碗湯建議 3 樣材料。材料的完整欄位（採集挑戰、圓塊視覺等）在「主題材料」分頁編輯。
      </p>
    </div>
  );
}
