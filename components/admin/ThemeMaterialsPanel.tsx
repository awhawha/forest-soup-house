import Link from "next/link";
import { prisma } from "@/lib/db";
import { attachThemeIngredient, detachThemeIngredient } from "@/lib/admin/actions";

/**
 * 主題包編輯頁的「這碗湯的材料」面板。
 * 材料改成材料庫共用：這裡從「材料庫」挑既有材料掛到這個主題（多對多），
 * 或把材料從這碗湯移除。材料本身（採集提示、圓塊視覺等）在「材料庫」分頁編輯，
 * 一改所有用到的主題一起變。
 */
export async function ThemeMaterialsPanel({ themeSlug }: { themeSlug: string }) {
  const [links, allIngredients] = await Promise.all([
    prisma.themeIngredient.findMany({
      where: { themeSlug },
      orderBy: { sortOrder: "asc" },
      include: { ingredient: true },
    }),
    prisma.ingredient.findMany({ orderBy: { name: "asc" } }),
  ]);

  const usedSlugs = new Set(links.map((l) => l.ingredientSlug));
  const available = allIngredients.filter((ing) => !usedSlugs.has(ing.slug));

  return (
    <div className="mt-6 rounded-2xl border border-border-card bg-paper-card p-6 shadow-[var(--shadow-paper)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-lg font-medium">
          🌿 這碗湯的材料（{links.length}）
        </h2>
        <Link
          href="/admin/ingredients/new"
          className="rounded-xl border border-border-card px-4 py-2 text-sm text-wood transition-colors hover:bg-paper-section"
        >
          ＋ 建立新材料
        </Link>
      </div>

      {/* 從材料庫挑既有材料掛上 */}
      {available.length > 0 ? (
        <form
          action={attachThemeIngredient.bind(null, themeSlug)}
          className="mt-4 flex flex-wrap items-center gap-2"
        >
          <label htmlFor="attach-ingredient" className="text-sm text-wood-muted">
            從材料庫加入：
          </label>
          <select
            id="attach-ingredient"
            name="ingredientSlug"
            defaultValue=""
            required
            className="min-w-0 flex-1 rounded-xl border border-border-card bg-paper px-3 py-2 text-sm"
          >
            <option value="" disabled>
              選一個材料⋯
            </option>
            {available.map((ing) => (
              <option key={ing.slug} value={ing.slug}>
                {ing.glyph ? `${ing.glyph}　` : ""}
                {ing.name}（{ing.slug}）
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-moss px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-moss-hover"
          >
            加入這碗湯
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-wood-muted">
          {allIngredients.length === 0
            ? "材料庫還是空的。先按「＋ 建立新材料」建立，再回來掛上。"
            : "材料庫裡的材料都已掛在這碗湯了。"}
        </p>
      )}

      {links.length === 0 ? (
        <p className="mt-4 text-sm text-wood-muted">
          這個主題包還沒有材料。用上面的下拉選單從材料庫挑，或建立新材料。
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border-paper/60">
          {links.map((link) => {
            const ing = link.ingredient;
            return (
              <li key={link.id} className="flex items-center justify-between gap-3 py-3">
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
                <div className="flex shrink-0 items-center gap-3">
                  <Link
                    href={`/admin/ingredients/${encodeURIComponent(ing.slug)}`}
                    className="text-sm font-medium text-moss hover:underline"
                  >
                    編輯
                  </Link>
                  <form action={detachThemeIngredient.bind(null, themeSlug, link.id)}>
                    <button
                      type="submit"
                      className="text-sm font-medium text-wood-muted transition-colors hover:text-red-600"
                    >
                      移除
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-4 text-xs leading-relaxed text-wood-muted">
        提示：一碗湯建議 3 樣材料。「移除」只是把材料從這碗湯拿掉，不會刪掉材料庫本身；材料的完整欄位在「材料庫」分頁編輯，改一次所有用到的主題一起更新。
      </p>
    </div>
  );
}
