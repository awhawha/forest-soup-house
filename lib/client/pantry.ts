/**
 * 湯湯屋 client 資料層 — 依 spec 的 localStorage key 對照表實作。
 * 收藏只增不減；跨頁同步：storage / focus / 自訂事件 soup-changed。
 * 只能在瀏覽器使用（所有函式都有 window 防護）。
 */

export const KEYS = {
  pantry: "stt_pantry_v1",
  cabinet: "soupHouseCabinetV1",
  cooked: "stt_map_cooked",
  garden: "stt_garden_v1",
  post: "stt_post_v1",
  potHistory: "stt_cooked_soups",
  storyScene: "stt_story_scene_v1",
  audioPos: "stt_audio_pos_v1",
} as const;

export const SOUP_CHANGED = "soup-changed";
export const CABINET_OPEN = "soup-cabinet-open";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 容量滿等錯誤：靜默 */
  }
}

export function emitSoupChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SOUP_CHANGED));
}

export function openCabinet(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CABINET_OPEN));
}

// ---------- 香料收藏（pantry）：只增不減 ----------

export interface Find {
  when: number;
  /** IndexedDB 照片 id */
  photoId?: string;
  scent?: string;
}

export interface PantryEntry {
  firstWhen: number;
  finds: Find[];
}

export type Pantry = Record<string, PantryEntry>;

export function getPantry(): Pantry {
  return read<Pantry>(KEYS.pantry, {});
}

export function hasIngredient(slug: string): boolean {
  return !!getPantry()[slug];
}

export function findCount(slug: string): number {
  const e = getPantry()[slug];
  return e?.finds?.length ?? (e ? 1 : 0);
}

export function latestPhotoId(slug: string): string | null {
  const finds = getPantry()[slug]?.finds ?? [];
  for (let i = finds.length - 1; i >= 0; i--) {
    if (finds[i].photoId) return finds[i].photoId!;
  }
  return null;
}

/** 採到一樣材料（深度收藏）。回傳 { first, count } */
export function addFind(
  slug: string,
  data?: { photoId?: string; scent?: string },
): { first: boolean; count: number } {
  const pantry = getPantry();
  const first = !pantry[slug];
  const entry = pantry[slug] ?? { firstWhen: Date.now(), finds: [] };
  if (!entry.finds) entry.finds = [];
  entry.finds.push({ when: Date.now(), ...data });
  pantry[slug] = entry;
  write(KEYS.pantry, pantry);
  emitSoupChanged();
  return { first, count: entry.finds.length };
}

// ---------- 湯譜卡紀念冊（cabinet） ----------

interface CabinetData {
  cards: string[];
}

/** 一開始就擁有的紀念卡（上一次旅程的蜜柑暖暖湯） */
const STARTER_CARDS = ["sunrise-orange"];

export function getCabinetCards(): string[] {
  const d = read<CabinetData>(KEYS.cabinet, { cards: [...STARTER_CARDS] });
  return Array.isArray(d.cards) && d.cards.length ? d.cards : [...STARTER_CARDS];
}

export function addCabinetCard(id: string): void {
  const cards = getCabinetCards();
  if (!cards.includes(id)) {
    cards.push(id);
    write(KEYS.cabinet, { cards });
    emitSoupChanged();
  }
}

// ---------- 湯譜石（週故事湯煮好的鍋數 0-9+） ----------

export function getCooked(): number {
  if (typeof window === "undefined") return 0;
  const n = parseInt(localStorage.getItem(KEYS.cooked) ?? "0", 10);
  return Number.isNaN(n) ? 0 : Math.max(0, n);
}

export function setCooked(n: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.cooked, String(Math.max(0, n)));
  emitSoupChanged();
}

/** 煮好一鍋週故事湯：湯譜石 +1、湯譜卡入冊 */
export function finishWeekSoup(weekCardId: string): void {
  setCooked(getCooked() + 1);
  addCabinetCard(weekCardId);
}

// ---------- 晾曬架（草藥花園） ----------

export interface RackItem {
  id: string;
  scent: string;
  /** 什麼時候會乾（timestamp） */
  dryAt: number;
  /** 對應的收藏材料 slug（收下來時寫入 pantry 用） */
  slug?: string;
  name?: string;
}

interface GardenData {
  rack: RackItem[];
}

export function getRack(): RackItem[] {
  return read<GardenData>(KEYS.garden, { rack: [] }).rack ?? [];
}

export function hangOnRack(item: Omit<RackItem, "id">): void {
  const rack = getRack();
  rack.push({ id: `rack-${Date.now()}-${rack.length}`, ...item });
  write(KEYS.garden, { rack });
  emitSoupChanged();
}

export function isDry(item: RackItem): boolean {
  return Date.now() >= item.dryAt;
}

/** 收下曬乾的東西：從架上移除並寫入收藏 */
export function collectFromRack(id: string): RackItem | null {
  const rack = getRack();
  const idx = rack.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const [item] = rack.splice(idx, 1);
  write(KEYS.garden, { rack });
  if (item.slug) {
    addFind(item.slug, { scent: item.scent });
  } else {
    emitSoupChanged();
  }
  return item;
}

// ---------- 森林郵局 ----------

export interface PostState {
  /** 信在路上 */
  transit: boolean;
  sentAt?: number;
  /** 什麼時候會收到回信 */
  replyAt?: number;
  /** 寄出的卡片照片 id */
  photoId?: string;
  /** 已讀回信數 */
  repliesRead: number;
}

export function getPost(): PostState {
  return read<PostState>(KEYS.post, { transit: false, repliesRead: 0 });
}

export function sendLetter(photoId: string | undefined, replyDelayMs: number): void {
  write(KEYS.post, {
    transit: true,
    sentAt: Date.now(),
    replyAt: Date.now() + replyDelayMs,
    photoId,
    repliesRead: getPost().repliesRead,
  } satisfies PostState);
  emitSoupChanged();
}

export function replyReady(state: PostState = getPost()): boolean {
  return state.transit && !!state.replyAt && Date.now() >= state.replyAt;
}

export function readReply(): void {
  const s = getPost();
  write(KEYS.post, {
    transit: false,
    repliesRead: (s.repliesRead ?? 0) + 1,
  } satisfies PostState);
  emitSoupChanged();
}

// ---------- 湯鍋（日常廚房）紀錄：不推進湯譜石 ----------

export interface CookedSoup {
  name: string;
  kind: "found" | "free";
  ingredientSlugs: string[];
  when: number;
}

export function getPotHistory(): CookedSoup[] {
  return read<CookedSoup[]>(KEYS.potHistory, []);
}

export function recordPotSoup(soup: Omit<CookedSoup, "when">): void {
  const list = getPotHistory();
  list.push({ ...soup, when: Date.now() });
  write(KEYS.potHistory, list);
  emitSoupChanged();
}

// ---------- 作品牆（照片 id 列表；與首頁「最新的作品」同步） ----------

const WORKS_KEY = "stt_works_v1";

export function getWorks(): string[] {
  return read<string[]>(WORKS_KEY, []);
}

export function addWork(photoId: string): void {
  const list = getWorks();
  list.unshift(photoId);
  write(WORKS_KEY, list);
  emitSoupChanged();
}

// ---------- 音檔播放位置（親子版故事） ----------

export function getAudioPos(key: string): number {
  const map = read<Record<string, number>>(KEYS.audioPos, {});
  return map[key] ?? 0;
}

export function saveAudioPos(key: string, pos: number): void {
  const map = read<Record<string, number>>(KEYS.audioPos, {});
  map[key] = pos;
  write(KEYS.audioPos, map);
}
