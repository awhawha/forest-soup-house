/**
 * 一次性搬遷：舊 ThemeIngredient（材料內容內嵌）→ 新 Ingredient 材料庫 + 關聯。
 *
 * 這支只做「加法」（建表 / 加欄位 / 灌資料），不刪任何東西 → 安全、可重跑。
 * 收尾（移除舊欄位、把 ingredientSlug 設必填）交給下一步的 prisma db push。
 *
 * 完整流程：
 *   1. 修好 .env 的 DB 密碼
 *   2. npx tsx prisma/migrate-ingredients.ts     ← 本檔（加法搬遷）
 *   3. npx prisma db push --accept-data-loss      ← 收掉舊欄位、定案關聯
 *   4. npx prisma generate
 *
 * 做的事：
 *   - 建 "Ingredient" 材料庫表（欄位對齊 schema.prisma 的 Ingredient）
 *   - 從舊 "ThemeIngredient" 依 slug 去重，把材料內容灌進材料庫
 *   - 幫 "ThemeIngredient" 加 ingredientSlug 欄位並回填 = 原本的 slug
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1) 建材料庫（欄位型別對齊 Prisma：Json → jsonb，選填 → nullable）
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Ingredient" (
      "slug"         TEXT PRIMARY KEY,
      "name"         TEXT NOT NULL,
      "description"  TEXT NOT NULL,
      "locationSlug" TEXT NOT NULL,
      "locationName" TEXT NOT NULL,
      "collection"   JSONB,
      "glyph"        TEXT,
      "tile"         TEXT,
      "gradient"     TEXT,
      "colorSolid"   TEXT,
      "scent"        TEXT,
      "guide"        TEXT,
      "example"      TEXT,
      "question"     TEXT,
      "options"      JSONB
    );
  `);
  console.log('✅ "Ingredient" 材料庫表就緒');

  // 2) 從舊資料去重灌入（同 slug 取一筆，依 themeSlug 決定順序）
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Ingredient" (
      "slug","name","description","locationSlug","locationName","collection",
      "glyph","tile","gradient","colorSolid","scent",
      "guide","example","question","options"
    )
    SELECT DISTINCT ON ("slug")
      "slug","name","description","locationSlug","locationName","collection",
      "glyph","tile","gradient","colorSolid","scent",
      "guide","example","question","options"
    FROM "ThemeIngredient"
    ORDER BY "slug", "themeSlug"
    ON CONFLICT ("slug") DO NOTHING;
  `);
  const [{ count: ingCount }] = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
    `SELECT COUNT(*)::bigint AS count FROM "Ingredient";`,
  );
  console.log(`✅ 材料庫共 ${ingCount} 種`);

  // 回報跨主題內容不同的 slug（會被去重成一筆，先讓你知道）
  const conflicts = await prisma.$queryRawUnsafe<{ slug: string; n: bigint }[]>(`
    SELECT "slug", COUNT(DISTINCT (
      "name","description","locationSlug","locationName","collection"::text,
      "glyph","tile","gradient","colorSolid","scent","guide","example","question","options"::text
    )) AS n
    FROM "ThemeIngredient"
    GROUP BY "slug"
    HAVING COUNT(DISTINCT (
      "name","description","locationSlug","locationName","collection"::text,
      "glyph","tile","gradient","colorSolid","scent","guide","example","question","options"::text
    )) > 1;
  `);
  if (conflicts.length) {
    console.log("\n⚠️  以下 slug 在不同主題內容不一致，已去重成一筆（請到材料庫確認）：");
    conflicts.forEach((c) => console.log(`   ${c.slug}`));
    console.log("");
  }

  // 3) 幫 ThemeIngredient 加關聯欄位並回填
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "ThemeIngredient" ADD COLUMN IF NOT EXISTS "ingredientSlug" TEXT;`,
  );
  await prisma.$executeRawUnsafe(
    `UPDATE "ThemeIngredient" SET "ingredientSlug" = "slug" WHERE "ingredientSlug" IS NULL;`,
  );
  const [{ count: linkCount }] = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
    `SELECT COUNT(*)::bigint AS count FROM "ThemeIngredient" WHERE "ingredientSlug" IS NOT NULL;`,
  );
  console.log(`✅ 已回填 ${linkCount} 筆關聯（ThemeIngredient.ingredientSlug）`);

  console.log(
    '\n下一步：npx prisma db push --accept-data-loss（收掉舊欄位、把 ingredientSlug 設必填＋外鍵）',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
