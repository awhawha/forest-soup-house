"use client";

/**
 * 使用者週進度（本機）— 每週一筆，key = 週次。
 * 依規格 §1.3：storyDone / found[3] / cookedAt / craftDone / printedAt。
 * 徽章不另建表：cookedAt != null ⟺ 該週徽章已獲得。
 */

const KEY = "soupHouseWeekProgressV1";
export const SOUP_CHANGED = "soup-changed";

export interface Capture {
  kind: "photo" | "answer";
  /** kind=photo：IndexedDB 照片 id */
  photoId?: string;
  /** kind=answer：選了第幾個選項 */
  answerIdx?: number;
  at: number;
}

export interface WeekProgress {
  storyDone: boolean;
  /** null = 未找到；順序對應該週 materials */
  found: (Capture | null)[];
  /** null = 未煮；設值＝徽章已發 */
  cookedAt: number | null;
  craftDone: boolean;
  printedAt: number | null;
}

type Store = Record<string, WeekProgress>;

export function emitSoupChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SOUP_CHANGED));
}

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    return (JSON.parse(localStorage.getItem(KEY) || "{}") as Store) || {};
  } catch {
    return {};
  }
}

function writeStore(s: Store): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* quota: 靜默 */
  }
  emitSoupChanged();
}

export function emptyProgress(): WeekProgress {
  return {
    storyDone: false,
    found: [null, null, null],
    cookedAt: null,
    craftDone: false,
    printedAt: null,
  };
}

export function getWeekProgress(week: number): WeekProgress {
  const p = readStore()[String(week)];
  if (!p) return emptyProgress();
  // 容錯：found 長度補足 3
  const found = [...(p.found ?? [])];
  while (found.length < 3) found.push(null);
  return { ...emptyProgress(), ...p, found: found.slice(0, 3) };
}

function patch(week: number, fn: (p: WeekProgress) => WeekProgress): void {
  const store = readStore();
  const cur = store[String(week)] ?? emptyProgress();
  const found = [...(cur.found ?? [null, null, null])];
  while (found.length < 3) found.push(null);
  store[String(week)] = fn({ ...cur, found });
  writeStore(store);
}

export function setStoryDone(week: number): void {
  patch(week, (p) => ({ ...p, storyDone: true }));
}

/** 採到一樣材料（拍照或用說的），即時寫入單樣 */
export function setFound(week: number, index: number, capture: Capture): void {
  patch(week, (p) => {
    const found = [...p.found];
    found[index] = capture;
    return { ...p, found };
  });
}

/** 煮好湯（＝發徽章）。冪等：已煮過不覆蓋時間 */
export function setCooked(week: number): void {
  patch(week, (p) => (p.cookedAt ? p : { ...p, cookedAt: Date.now() }));
}

export function setCraftDone(week: number): void {
  patch(week, (p) => ({ ...p, craftDone: true }));
}

export function setPrinted(week: number): void {
  patch(week, (p) => ({ ...p, printedAt: p.printedAt ?? Date.now() }));
}

// ---------- 衍生查詢 ----------

export function foundCount(p: WeekProgress): number {
  return p.found.filter(Boolean).length;
}

export function allFound(p: WeekProgress): boolean {
  return foundCount(p) >= 3;
}

/** 第一個未找到的材料 index；全找到回 -1 */
export function firstUnfound(p: WeekProgress): number {
  return p.found.findIndex((f) => !f);
}

/** 已煮過的週數（＝認識的朋友數，每完成一週 +1；含起始 1 位菲娜） */
export function cookedWeeksCount(): number {
  const store = readStore();
  return Object.values(store).filter((p) => p.cookedAt != null).length;
}

/** 這週湯卡是否已擁有（煮過） */
export function isCooked(week: number): boolean {
  return getWeekProgress(week).cookedAt != null;
}

/** demo：清掉某週進度 */
export function resetWeek(week: number): void {
  const store = readStore();
  delete store[String(week)];
  writeStore(store);
}
