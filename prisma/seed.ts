/**
 * 把 data/*.ts 的內容匯入資料庫。
 * 執行：npm run db:seed
 * 可重複執行（upsert / 先清除子表再重建），不會產生重複資料。
 */
import { Prisma, PrismaClient } from "@prisma/client";
import { characters } from "../data/characters";
import { locations } from "../data/locations";
import { adventures } from "../data/adventures";
import { todaysAdventures } from "../data/todaysAdventures";
import { themes } from "../data/themes";
import {
  finaActivities,
  weatherMoods,
  dailyQuestions,
  poffyQuotes,
} from "../data/soup-house";

const prisma = new PrismaClient();

async function main() {
  // ---------- 角色 ----------
  for (const [i, c] of characters.entries()) {
    const data = {
      name: c.name,
      nameZh: c.nameZh ?? null,
      tagline: c.tagline,
      taglineZh: c.taglineZh ?? null,
      bio: c.bio ?? null,
      bioZh: c.bioZh ?? null,
      quote: c.quote ?? null,
      quoteZh: c.quoteZh ?? null,
      quoteAttribution: c.quoteAttribution ?? null,
      image: c.image ?? null,
      links: c.links ? (c.links as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
      sortOrder: i,
    };
    await prisma.character.upsert({
      where: { slug: c.slug },
      create: { slug: c.slug, ...data },
      update: data,
    });
  }
  console.log(`✓ 角色 ${characters.length} 筆`);

  // ---------- 地點 ----------
  for (const [i, l] of locations.entries()) {
    const data = {
      name: l.name,
      nameEn: l.nameEn,
      emoji: l.emoji,
      tagline: l.tagline,
      description: l.description,
      atmosphere: l.atmosphere,
      image: l.image ?? null,
      status: l.status,
      href: l.href ?? null,
      sortOrder: i,
    };
    await prisma.location.upsert({
      where: { slug: l.slug },
      create: { slug: l.slug, ...data },
      update: data,
    });
  }
  console.log(`✓ 地點 ${locations.length} 筆`);

  // ---------- 小冒險 ----------
  for (const [i, a] of adventures.entries()) {
    const { slug, ...rest } = a;
    const data = { ...rest, sortOrder: i };
    await prisma.adventure.upsert({
      where: { slug },
      create: { slug, ...data },
      update: data,
    });
  }
  console.log(`✓ 小冒險 ${adventures.length} 筆`);

  // ---------- 首頁今日小冒險卡 ----------
  for (const [i, t] of todaysAdventures.entries()) {
    const data = {
      slug: t.slug,
      title: t.title,
      titleZh: t.titleZh ?? null,
      prompt: t.prompt,
      promptZh: t.promptZh ?? null,
      narrative: t.narrative ?? null,
      narrativeZh: t.narrativeZh ?? null,
      characterName: t.characterName ?? null,
      characterNameZh: t.characterNameZh ?? null,
      location: t.location ?? null,
      locationZh: t.locationZh ?? null,
      sortOrder: i,
    };
    await prisma.todaysAdventure.upsert({
      where: { id: t.id },
      create: { id: t.id, ...data },
      update: data,
    });
  }
  console.log(`✓ 今日小冒險卡 ${todaysAdventures.length} 筆`);

  // ---------- 主題包（含材料、書單） ----------
  for (const [i, t] of themes.entries()) {
    const data = {
      title: t.title,
      tagline: t.tagline,
      image: t.image ?? null,
      storyContent: t.storyContent,
      audioSrc: t.audioSrc ?? null,
      magicSubtitleZh: t.magicSubtitleZh ?? null,
      magicParagraphsZh: t.magicParagraphsZh
        ? (t.magicParagraphsZh as unknown as Prisma.InputJsonValue)
        : Prisma.JsonNull,
      magicParagraphsEn: t.magicParagraphsEn
        ? (t.magicParagraphsEn as unknown as Prisma.InputJsonValue)
        : Prisma.JsonNull,
      magicImageSrc: t.magicImageSrc ?? null,
      magicImageAlt: t.magicImageAlt ?? null,
      adventureTitle: t.adventure.title,
      adventureDescription: t.adventure.description,
      craftTitle: t.natureCraft.title,
      craftDescription: t.natureCraft.description,
      badgeName: t.badgeName,
      parentNoteTheme: t.parentNote.theme,
      parentNoteSkills: t.parentNote.skills as unknown as Prisma.InputJsonValue,
      parentNoteTalkingPoint: t.parentNote.talkingPoint,
      sortOrder: i,
    };
    await prisma.theme.upsert({
      where: { slug: t.slug },
      create: { slug: t.slug, ...data },
      update: data,
    });

    // 子表：先清掉再重建，確保與 data 檔一致
    await prisma.themeIngredient.deleteMany({ where: { themeSlug: t.slug } });
    await prisma.themeIngredient.createMany({
      data: t.ingredients.map((ing, j) => ({
        themeSlug: t.slug,
        slug: ing.slug,
        name: ing.name,
        description: ing.description,
        locationSlug: ing.locationSlug,
        locationName: ing.locationName,
        collection: ing.collection as unknown as Prisma.InputJsonValue,
        sortOrder: j,
      })),
    });

    await prisma.themeBook.deleteMany({ where: { themeSlug: t.slug } });
    await prisma.themeBook.createMany({
      data: t.books.map((b, j) => ({
        themeSlug: t.slug,
        title: b.title,
        author: b.author,
        reason: b.reason,
        sortOrder: j,
      })),
    });
  }
  console.log(`✓ 主題包 ${themes.length} 筆（含材料與書單）`);

  // ---------- 湯湯屋每日文案 ----------
  await prisma.ambientText.deleteMany();
  const ambient = [
    ...finaActivities.map((text, i) => ({ kind: "fina-activity", text, sortOrder: i })),
    ...dailyQuestions.map((text, i) => ({ kind: "daily-question", text, sortOrder: i })),
    ...poffyQuotes.map((text, i) => ({ kind: "poffy-quote", text, sortOrder: i })),
    ...weatherMoods.map((text, i) => ({ kind: "weather-mood", text, sortOrder: i })),
  ];
  await prisma.ambientText.createMany({ data: ambient });
  console.log(`✓ 每日文案 ${ambient.length} 筆`);

  console.log("\n全部匯入完成 🍲");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
