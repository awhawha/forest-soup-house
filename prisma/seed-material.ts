/**
 * 把 material-copy.json（v2 採集文案）寫進主題材料，並從 gradient 推導 colorSolid。
 * 執行：npx tsx prisma/seed-material.ts（可重複）
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Copy {
  guide: string;
  example: string;
  question: string;
  options: string[];
}

/** 取 gradient 字串裡最後一個 hex 當主色（＝較深的色停） */
function solidFromGradient(gradient: string | null): string | null {
  if (!gradient) return null;
  const hexes = gradient.match(/#[0-9a-fA-F]{3,8}/g);
  return hexes && hexes.length ? hexes[hexes.length - 1] : null;
}

async function main() {
  const copy = JSON.parse(
    readFileSync(join(__dirname, "material-copy.json"), "utf8"),
  ) as Record<string, Copy>;

  const rows = await prisma.ingredient.findMany();
  let updated = 0;
  const missing: string[] = [];

  for (const row of rows) {
    const c = copy[row.slug];
    if (!c) {
      missing.push(row.slug);
      continue;
    }
    await prisma.ingredient.update({
      where: { slug: row.slug },
      data: {
        guide: c.guide,
        example: c.example,
        question: c.question,
        options: c.options as unknown as Prisma.InputJsonValue,
        colorSolid: row.colorSolid ?? solidFromGradient(row.gradient),
      },
    });
    updated++;
  }

  console.log(`✓ 已寫入 ${updated} 個材料的採集文案 + colorSolid`);
  if (missing.length) console.log("⚠️ material-copy.json 缺少:", missing.join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
