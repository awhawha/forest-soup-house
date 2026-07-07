"use client";

/**
 * 森林地點的本機存檔 + 示範資料（單一事實來源＝設計母稿 v3）。
 * 只寫自己這一份 key，勿清掉別人的。nv3.* 為本地示範命名，正式接後端時改對應 API。
 *   花園 stt_garden_v1 / 小河 nv3.river.v1 / 熟成室 nv3.shed.v1 / 郵局 nv3.post.v1
 */
import { emitSoupChanged } from "@/lib/client/weekProgress";

// ── 通用讀寫 ──
function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(key) || "null") as T | null;
  } catch {
    return null;
  }
}
function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota: 靜默 */
  }
  emitSoupChanged();
}

// ═══ 草藥花園（採花 → 晾曬 → 收藏）═══
export const GARDEN_KEY = "stt_garden_v1";
export const GD_SCENTS = ["曬過太陽的棉被", "雨後的泥土", "甜甜的糖果"];
export const GD_FLOWER = { name: "安心的小花", glyph: "花", color: "radial-gradient(circle at 40% 35%,#f0b8c8,#d97a95)" };

export interface GardenFlower {
  id: number;
  scent: string;
  dry: boolean;
}
export function getGardenRack(): GardenFlower[] {
  return read<{ rack: GardenFlower[] }>(GARDEN_KEY)?.rack ?? [];
}
export function setGardenRack(rack: GardenFlower[]): void {
  write(GARDEN_KEY, { rack });
}

// ═══ 湯湯小河（每天漂來一樣東西）═══
export const RIVER_KEY = "nv3.river.v1";
export interface RiverItem {
  name: string;
  glyph: string;
  color: string;
  line: string;
}
export const RIVER_ITEMS: RiverItem[] = [
  { name: "一片薄荷葉", glyph: "葉", color: "radial-gradient(circle at 40% 35%,#9fd4a8,#4f8a52)", line: "涼涼的，聞起來像會唱歌。" },
  { name: "玫瑰色的小石頭", glyph: "石", color: "radial-gradient(circle at 40% 35%,#f0b8c8,#c47e92)", line: "被河水磨得圓圓的，握著暖暖的。" },
  { name: "瓶中信", glyph: "信", color: "radial-gradient(circle at 40% 35%,#8fb8cf,#4a7f95)", line: "微光說：今天的河水，特別亮。" },
  { name: "一顆小松果", glyph: "果", color: "radial-gradient(circle at 40% 35%,#d9a86a,#a5713a)", line: "不知道是誰掉的，先幫他收著吧。" },
];
export interface RiverState {
  date: string;
  idx: number;
  caught: boolean;
}
function todayStamp(): string {
  return new Date().toDateString();
}
/** mount 時載入：無紀錄或不是今天 → 隨機挑一件、未撈 */
export function loadRiver(): RiverState {
  let r = read<RiverState>(RIVER_KEY);
  if (!r || r.date !== todayStamp()) {
    r = { date: todayStamp(), idx: Math.floor(Math.random() * RIVER_ITEMS.length), caught: false };
    write(RIVER_KEY, r);
  }
  return r;
}
export function setRiver(r: RiverState): void {
  write(RIVER_KEY, r);
}
/** demo ⏩明天：換下一件、未撈 */
export function riverTomorrow(cur: RiverState | null): RiverState {
  const r: RiverState = { date: todayStamp(), idx: ((cur ? cur.idx : 0) + 1) % RIVER_ITEMS.length, caught: false };
  write(RIVER_KEY, r);
  return r;
}

// ═══ 熟成室（裝罐 → 隔夜熟成 → 收下）═══
export const SHED_KEY = "nv3.shed.v1";
export interface ShedScent {
  name: string;
  glyph: string;
  color: string;
}
export const SH_SCENTS: ShedScent[] = [
  { name: "安心的小花", glyph: "花", color: "radial-gradient(circle at 40% 35%,#f0b8c8,#d97a95)" },
  { name: "會唱歌的薄荷", glyph: "荷", color: "radial-gradient(circle at 40% 35%,#9fd4a8,#4f8a52)" },
  { name: "蜂蜜葉", glyph: "蜜", color: "radial-gradient(circle at 40% 35%,#e8c26a,#b5883a)" },
];
export interface ShedJar extends ShedScent {
  ready: boolean;
}
export function getShedJars(): ShedJar[] {
  return read<{ jars: ShedJar[] }>(SHED_KEY)?.jars ?? [];
}
export function setShedJars(jars: ShedJar[]): void {
  write(SHED_KEY, { jars });
}

// ═══ 森林郵局（寄信 → 等回信）═══
export const POST_KEY = "nv3.post.v1";
export const PO_CHARS = ["菲娜", "Milo 小松鼠", "波飛", "Meelo 貓頭鷹", "里洛", "微光", "蓬蓬", "Pipit 小鳥", "小噗"];
export const PO_REPLIES: Record<string, string> = {
  菲娜: "你的信，我貼在爐火旁邊了。",
  "Milo 小松鼠": "信紙有一點點香香的，我聞出來了！",
  波飛: "我把你的信唸給爐火聽，它燒得更旺了。",
  "Meelo 貓頭鷹": "我在最高的樹上讀完了。寫得很好。",
  里洛: "我把它夾在最喜歡的葉子標本旁邊。",
  微光: "我讓河水替你唱了一首歌。",
  蓬蓬: "謝謝你告訴我。我會好好收著。",
  "Pipit 小鳥": "回信我親自送的，一秒都沒遲到！",
  小噗: "我讀信的時候差點打翻湯——但沒有！",
};
export interface Letter {
  to: string;
  text: string;
  replied: boolean;
}
export function getLetters(): Letter[] {
  return read<{ letters: Letter[] }>(POST_KEY)?.letters ?? [];
}
export function setLetters(letters: Letter[]): void {
  write(POST_KEY, { letters });
}

// ═══ 森林觀察站（低語大樹）═══
export const TREE_LINES = [
  "今天的風，聞起來有一點點甜。",
  "慢慢走，湯料不會跑掉的。",
  "菲娜的鍋子，從早上就開始咕嘟咕嘟了。",
  "你上次帶回來的花，森林還記得。",
  "往草藥花園的小路上，今天有蝴蝶。",
];

// ═══ 湯料魔法研究所（混兩種香味搖一搖，不存檔）═══
export interface LabScent {
  n: string;
  adj: string;
  c: string;
}
export const LAB_SCENTS: LabScent[] = [
  { n: "安心的小花", adj: "軟綿綿的", c: "#f0b8c8" },
  { n: "會唱歌的薄荷", adj: "會唱歌的", c: "#9fd4a8" },
  { n: "蜂蜜葉", adj: "甜甜的", c: "#e8c26a" },
  { n: "雨後的泥土", adj: "剛睡醒的", c: "#c9a582" },
  { n: "星星糖", adj: "一閃一閃的", c: "#b9a7cf" },
];
export const LAB_LINES = [
  "喝一口，會從腳趾頭暖起來。",
  "搖的時候，它偷偷眨了一下眼睛。",
  "聞起來像一個還沒說出口的秘密。",
  "里洛說：這罐要小聲一點喝。",
];

// ═══ 角色角（朋友照片牆）═══
export interface GroveChar {
  name: string;
  home: string;
  isFina?: boolean;
  isMilo?: boolean;
  glyph?: string;
  avBg: string;
  tilt: string;
}
export const GROVE_CHARS: GroveChar[] = [
  { name: "菲娜", home: "湯湯屋主屋", isFina: true, avBg: "#f4e6cf", tilt: "-1.6deg" },
  { name: "Milo 小松鼠", home: "草藥花園", isMilo: true, avBg: "#fff", tilt: "1.8deg" },
  { name: "波飛", home: "熟成室", glyph: "飛", avBg: "radial-gradient(circle at 40% 35%,#f0b45a,#d9733a)", tilt: "-1.2deg" },
  { name: "Meelo 貓頭鷹", home: "森林觀察站", glyph: "梅", avBg: "radial-gradient(circle at 40% 35%,#b9a7cf,#7a6a95)", tilt: "1.4deg" },
  { name: "里洛", home: "湯料魔法研究所", glyph: "里", avBg: "radial-gradient(circle at 40% 35%,#8cc47e,#4f8a52)", tilt: "-1.8deg" },
  { name: "微光", home: "湯湯小河", glyph: "微", avBg: "radial-gradient(circle at 40% 35%,#8fb8cf,#4a7f95)", tilt: "1.2deg" },
  { name: "蓬蓬", home: "熟成室", glyph: "蓬", avBg: "radial-gradient(circle at 40% 35%,#cbb8d8,#8a7aa5)", tilt: "-1.4deg" },
  { name: "Pipit 小鳥", home: "森林郵局", glyph: "鳥", avBg: "radial-gradient(circle at 40% 35%,#e0a860,#b5763a)", tilt: "1.6deg" },
  { name: "小噗", home: "角色角", glyph: "噗", avBg: "radial-gradient(circle at 40% 35%,#d9a086,#b06a4a)", tilt: "-1.1deg" },
];
