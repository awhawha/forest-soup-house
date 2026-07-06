/**
 * 週更體驗的 server 內容層 — 從資料庫組出各頁需要的資料包。
 * 只能在 Server Component / Server Action 使用。
 */
import { cache } from "react";
import { prisma } from "@/lib/db";

// ---------- 型別（傳給 client 元件的可序列化資料）----------

export interface WeekIngredient {
  slug: string;
  name: string;
  description: string;
  locationSlug: string;
  locationName: string;
  glyph: string;
  tile: string;
  gradient: string;
  scent: string;
}

export interface WeekBundle {
  weekNumber: number;
  totalWeeks: number;
  letter: string;
  themeSlug: string;
  /** 湯名（＝主題標題） */
  soupName: string;
  tagline: string;
  image: string | null;
  audioSrc: string | null;
  magicSubtitleZh: string | null;
  /** 故事段落（優先 magicParagraphsZh，否則 storyContent 以空行分段） */
  paragraphs: string[];
  badgeName: string;
  adventureTitle: string;
  adventureDescription: string;
  craftTitle: string;
  craftDescription: string;
  parentTalkingPoint: string;
  ingredients: WeekIngredient[];
}

export interface WeekCardInfo {
  weekNumber: number;
  themeSlug: string;
  soupName: string;
  image: string | null;
  badgeName: string;
}

export interface MapPin {
  slug: string;
  name: string;
  glyph: string;
  x: number;
  y: number;
  unlockAtPot: number;
  tagline: string;
  description: string;
  /** 住戶介紹行（地點詳細卡） */
  residentLine: string | null;
  /** 住戶解鎖所需鍋數（顯示鎖住提示用） */
  residentUnlockAtPot: number | null;
  /** 有子頁時的路徑（草藥花園 / 森林郵局） */
  href: string | null;
}

export interface Resident {
  slug: string;
  displayName: string;
  kind: string;
  desc: string;
  quote: string;
  introLine: string | null;
  unlockAtPot: number;
  gradient: string | null;
  image: string | null;
}

export interface PotRecipeInfo {
  slug: string;
  name: string;
  ingredientSlugs: string[];
  image: string | null;
  flavorText: string | null;
}

/** 圖鑑用：所有週的材料（跨週累積） */
export interface DexIngredient extends WeekIngredient {
  weekNumber: number;
}

// ---------- 讀取 ----------

export const getCurrentWeekNumber = cache(async (): Promise<number> => {
  const row = await prisma.setting.findUnique({ where: { key: "currentWeek" } });
  const n = row ? parseInt(row.value, 10) : 1;
  return Number.isNaN(n) || n < 1 ? 1 : n;
});

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

type ThemeWithChildren = NonNullable<
  Awaited<
    ReturnType<
      typeof prisma.theme.findFirst<{ include: { ingredients: true; books: true } }>
    >
  >
>;

function toWeekIngredients(theme: ThemeWithChildren): WeekIngredient[] {
  return [...theme.ingredients]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((ing) => ({
      slug: ing.slug,
      name: ing.name,
      description: ing.description,
      locationSlug: ing.locationSlug,
      locationName: ing.locationName,
      glyph: ing.glyph ?? ing.name.slice(0, 1),
      tile: ing.tile ?? "#e8ddc2",
      gradient: ing.gradient ?? "radial-gradient(circle at 40% 35%,#e0cfa8,#b59a5f)",
      scent: ing.scent ?? ing.description,
    }));
}

export const getWeekBundle = cache(
  async (weekNumber?: number): Promise<WeekBundle | null> => {
    const current = weekNumber ?? (await getCurrentWeekNumber());
    const [total, theme] = await Promise.all([
      prisma.theme.count({ where: { weekNumber: { not: null } } }),
      prisma.theme.findFirst({
        where: { weekNumber: current },
        include: { ingredients: true, books: true },
      }),
    ]);
    if (!theme) return null;

    const paragraphs =
      (theme.magicParagraphsZh as string[] | null) ??
      splitParagraphs(theme.storyContent);

    return {
      weekNumber: theme.weekNumber ?? current,
      totalWeeks: total,
      letter: theme.letter ?? "",
      themeSlug: theme.slug,
      soupName: theme.title,
      tagline: theme.tagline,
      image: theme.image,
      audioSrc: theme.audioSrc,
      magicSubtitleZh: theme.magicSubtitleZh,
      paragraphs,
      badgeName: theme.badgeName,
      adventureTitle: theme.adventureTitle,
      adventureDescription: theme.adventureDescription,
      craftTitle: theme.craftTitle,
      craftDescription: theme.craftDescription,
      parentTalkingPoint: theme.parentNoteTalkingPoint,
      ingredients: toWeekIngredients(theme),
    };
  },
);

/** 紀念冊湯譜卡：全部週（依週序） */
export const getWeekCards = cache(async (): Promise<WeekCardInfo[]> => {
  const themes = await prisma.theme.findMany({
    where: { weekNumber: { not: null } },
    orderBy: { weekNumber: "asc" },
  });
  return themes.flatMap((t) => {
    if (t.weekNumber == null) return [];
    return [
      {
        weekNumber: t.weekNumber,
        themeSlug: t.slug,
        soupName: t.title,
        image: t.image,
        badgeName: t.badgeName,
      },
    ];
  });
});

/** 圖鑑：所有週材料（跨週累積、依週序） */
export const getAllWeekIngredients = cache(async (): Promise<DexIngredient[]> => {
  const themes = await prisma.theme.findMany({
    where: { weekNumber: { not: null } },
    orderBy: { weekNumber: "asc" },
    include: { ingredients: true, books: true },
  });
  return themes.flatMap((t) => {
    if (t.weekNumber == null) return [];
    const wn = t.weekNumber;
    return toWeekIngredients(t as ThemeWithChildren).map((ing) => ({
      ...ing,
      weekNumber: wn,
    }));
  });
});

/** 地圖 pin（含住戶資訊） */
export const getMapPins = cache(async (): Promise<MapPin[]> => {
  const [locations, residents] = await Promise.all([
    prisma.location.findMany({
      where: { mapX: { not: null } },
      orderBy: { unlockAtPot: "asc" },
    }),
    prisma.character.findMany({ where: { unlockAtPot: { not: null } } }),
  ]);
  const residentByLoc = new Map(residents.map((r) => [r.locationSlug, r]));
  const SUBPAGES: Record<string, string> = {
    "herbal-patch": "/map/herbal-patch",
    "forest-post": "/map/forest-post",
  };
  return locations.map((l) => {
    const r = residentByLoc.get(l.slug);
    return {
      slug: l.slug,
      name: l.name,
      glyph: l.glyph ?? l.name.slice(0, 1),
      x: l.mapX ?? 50,
      y: l.mapY ?? 50,
      unlockAtPot: l.unlockAtPot ?? 9,
      tagline: l.tagline,
      description: l.description,
      residentLine: r ? `${r.nameZh ?? r.name}住在這裡——${r.bioZh ?? ""}` : null,
      residentUnlockAtPot: r?.unlockAtPot ?? null,
      href: SUBPAGES[l.slug] ?? null,
    };
  });
});

/** 朋友們（9 位住戶，依認識順序） */
export const getResidents = cache(async (): Promise<Resident[]> => {
  const rows = await prisma.character.findMany({
    where: { unlockAtPot: { not: null } },
    orderBy: [{ unlockAtPot: "asc" }, { sortOrder: "asc" }],
  });
  return rows.map((r) => ({
    slug: r.slug,
    displayName: r.nameZh ?? r.name,
    kind: r.taglineZh ?? r.tagline,
    desc: r.bioZh ?? r.bio ?? "",
    quote: r.quoteZh ?? r.quote ?? "",
    introLine: r.introLine,
    unlockAtPot: r.unlockAtPot ?? 0,
    gradient: r.avatarGradient,
    image: r.image,
  }));
});

export const getPotRecipes = cache(async (): Promise<PotRecipeInfo[]> => {
  const rows = await prisma.potRecipe.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    ingredientSlugs: (r.ingredientSlugs as string[]) ?? [],
    image: r.image,
    flavorText: r.flavorText,
  }));
});
