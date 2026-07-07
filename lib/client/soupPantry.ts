"use client";

/**
 * 湯湯屋 · 共用香料收藏櫃（單一事實來源）— 從 soup-pantry.js 交接檔照搬。
 * 所有畫面（花園採集 / 圖鑑）都讀寫這一份，key = 'stt_pantry_v1'。
 *
 * 收藏模型：
 *  · 廣度 → 每週三樣材料（WEEKS）
 *  · 深度 → 每樣材料存 finds 陣列，每次真的採到多一筆（帶日期/香味/照片）
 *  · 收藏只增不減；煮湯結算本週食譜，不動收藏
 *
 * 注意：這份 WEEKS 是收藏櫃自帶的示範材料表（slug: flower/bread/icecream…），
 * 與資料庫的週材料（soft-flower…）是兩套；花園收藏櫃區塊讀的是這一份。
 * 介面照抄交接檔，勿改。
 */
import { emitSoupChanged } from "@/lib/client/weekProgress";

const KEY = "stt_pantry_v1";

export interface PantryIngredient {
  slug: string;
  name: string;
  place: string;
  locSlug: string;
  slotId: string;
  glyph: string;
  tile: string;
  color: string;
  scent: string;
}

export interface PantryFind {
  /** add() 會自動補上；呼叫端不必帶 */
  when?: number;
  scent?: string;
  photo?: string;
}

interface PantryEntry {
  firstWhen: number;
  finds: PantryFind[];
}

type PantryStore = Record<string, PantryEntry>;

export const WEEKS: Record<1 | 2, { soup: string; recipeId: string; letter: string; ingredients: PantryIngredient[] }> = {
  1: {
    soup: "記憶中的香香湯",
    recipeId: "memory",
    letter:
      "今天早上，湯的香味變淡了。\n我需要三樣材料——有的在森林裡，有的就藏在你家附近。\n帶上你的鼻子，我們一起把香味找回來。",
    ingredients: [
      { slug: "flower", name: "安心的小花", place: "草藥花園", locSlug: "herbal-patch", slotId: "mat-1", glyph: "花", tile: "#efc6d2", color: "radial-gradient(circle at 40% 35%,#f0b8c8,#d97a95)", scent: "像曬過太陽的棉被" },
      { slug: "bread", name: "早晨的麵包香", place: "湯料森林", locSlug: "ingredient-woods", slotId: "mat-2", glyph: "包", tile: "#e6c187", color: "radial-gradient(circle at 40% 35%,#e8c887,#c99a4a)", scent: "剛起床的味道" },
      { slug: "icecream", name: "甜甜的冰淇淋", place: "熟成室", locSlug: "brewing-shed", slotId: "mat-3", glyph: "甜", tile: "#c3d6e2", color: "radial-gradient(circle at 40% 35%,#bcd4e4,#7fa8c4)", scent: "最喜歡的味道" },
    ],
  },
  2: {
    soup: "月光菇菇湯",
    recipeId: "moonlight",
    letter:
      "昨天夜裡，月亮掉了一小塊光在森林裡。\n我想把它煮進湯裡——需要三樣會發亮的東西。\n天黑以後，跟我一起去找找看。",
    ingredients: [
      { slug: "mushroom", name: "月光蘑菇", place: "湯湯小河", locSlug: "soupling-stream", slotId: "w2-mat-1", glyph: "菇", tile: "#d9d2e8", color: "radial-gradient(circle at 40% 35%,#c5b5df,#8a76b5)", scent: "涼涼亮亮的味道" },
      { slug: "nightwind", name: "晚上的風", place: "悄悄耳語小屋", locSlug: "whisper-shed", slotId: "w2-mat-2", glyph: "風", tile: "#c9dde0", color: "radial-gradient(circle at 40% 35%,#a8ccd2,#5f95a0)", scent: "睡前開窗的味道" },
      { slug: "starsugar", name: "星星糖", place: "森林觀察站", locSlug: "observation-post", slotId: "w2-mat-3", glyph: "星", tile: "#f2e3b8", color: "radial-gradient(circle at 40% 35%,#f0d98a,#d9b04a)", scent: "甜甜脆脆的味道" },
    ],
  },
};

function read(): PantryStore {
  if (typeof window === "undefined") return {};
  try {
    return (JSON.parse(localStorage.getItem(KEY) || "{}") as PantryStore) || {};
  } catch {
    return {};
  }
}

function write(o: PantryStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(o));
  } catch {
    /* quota: 靜默 */
  }
}

/** 採到一樣材料：往它的相簿多加一筆（深度）。收藏只增。回傳 { first, count } */
function add(slug: string, data?: PantryFind): { first: boolean; count: number } {
  const p = read();
  const first = !p[slug];
  const prev: PantryEntry = p[slug] || { firstWhen: Date.now(), finds: [] };
  if (!prev.finds) prev.finds = [];
  prev.finds.push({ when: Date.now(), ...(data || {}) });
  p[slug] = prev;
  write(p);
  emitSoupChanged();
  return { first, count: prev.finds.length };
}

export const Soup = {
  KEY,
  WEEKS,
  pantry(): PantryStore {
    return read();
  },
  has(slug: string): boolean {
    return !!read()[slug];
  },
  add,
  count(slug: string): number {
    const e = read()[slug];
    return e && e.finds ? e.finds.length : e ? 1 : 0;
  },
  finds(slug: string): PantryFind[] {
    const e = read()[slug];
    return e && e.finds ? e.finds : [];
  },
};

// 交接契約：其他（非 React）畫面仍可透過 window.SOUP 讀寫同一份收藏。
if (typeof window !== "undefined") {
  (window as unknown as { SOUP?: typeof Soup }).SOUP = Soup;
}
