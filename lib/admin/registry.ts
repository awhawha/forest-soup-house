/**
 * 後台實體註冊表 — 每種內容型別的欄位定義。
 * /admin/[entity] 的列表、新增、編輯頁都由這份設定驅動。
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "lines" // 一行一項 → 存成 string[]（JSON）
  | "json"; // JSON 物件/陣列，進階欄位

export interface AdminField {
  name: string;
  label: string;
  type: FieldType;
  /** 必填（對應 DB not-null） */
  required?: boolean;
  /** 選填欄位：留空時存 null */
  optional?: boolean;
  /** select 的靜態選項 */
  options?: { value: string; label: string }[];
  /** select 選項改從其他資料表撈（value/label 為欄位名） */
  optionsFrom?: { model: string; value: string; label: string };
  help?: string;
  rows?: number;
  /** 主鍵欄位：編輯時唯讀 */
  readOnlyOnEdit?: boolean;
}

export interface AdminEntity {
  /** URL 段，如 /admin/characters */
  slug: string;
  label: string;
  icon: string;
  /** Prisma delegate 名稱，如 prisma.character */
  model: string;
  idField: string;
  idIsNumber?: boolean;
  /** 自動編號主鍵（新增時不用填） */
  autoId?: boolean;
  /** 列表頁顯示的欄位 */
  listFields: { name: string; label: string }[];
  fields: AdminField[];
  description?: string;
}

const sortOrderField: AdminField = {
  name: "sortOrder",
  label: "排序",
  type: "number",
  help: "數字小的排前面",
};

export const adminEntities: AdminEntity[] = [
  {
    slug: "settings",
    label: "設定",
    icon: "⚙️",
    model: "setting",
    idField: "key",
    description: "全站設定。currentWeek＝目前週次（想換週把 value 改成新的數字即可，前台立即生效）。",
    listFields: [
      { name: "key", label: "Key" },
      { name: "value", label: "Value" },
    ],
    fields: [
      { name: "key", label: "Key", type: "text", required: true, readOnlyOnEdit: true },
      { name: "value", label: "Value", type: "text", required: true },
    ],
  },
  {
    slug: "pot-recipes",
    label: "湯鍋食譜",
    icon: "🥣",
    model: "potRecipe",
    idField: "slug",
    description: "湯鍋（日常廚房）的「找到的食譜」。材料填圖鑑材料的 slug。",
    listFields: [
      { name: "slug", label: "Slug" },
      { name: "name", label: "湯名" },
    ],
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true, readOnlyOnEdit: true },
      { name: "name", label: "湯名", type: "text", required: true },
      { name: "ingredientSlugs", label: "需要的材料 slug", type: "lines", required: true, rows: 4, help: "一行一個，對應主題材料的 slug（例如 bread-chunk）" },
      { name: "image", label: "湯譜卡圖片路徑", type: "text", optional: true },
      { name: "flavorText", label: "缺料提示／一句話", type: "text", optional: true },
      sortOrderField,
    ],
  },
  {
    slug: "themes",
    label: "主題包",
    icon: "📖",
    model: "theme",
    idField: "slug",
    description:
      "一個主題包 = 一週 = 一碗湯（故事、菲娜的信、3 樣材料、冒險、手作、書單、家長筆記）。「目前第幾週」在「設定」分頁改 currentWeek。材料與書單在各自分頁管理。",
    listFields: [
      { name: "weekNumber", label: "週次" },
      { name: "title", label: "標題（湯名）" },
      { name: "badgeName", label: "徽章" },
    ],
    fields: [
      { name: "slug", label: "Slug（網址代稱）", type: "text", required: true, readOnlyOnEdit: true, help: "例如 memory-soup，建立後請勿更改" },
      { name: "weekNumber", label: "第幾週", type: "number", optional: true, help: "1–10；決定這是第幾週的湯。留空＝不排入週主線（例如草稿）。不可與其他主題包重複" },
      { name: "title", label: "標題（＝湯名）", type: "text", required: true },
      { name: "tagline", label: "副標／引言", type: "text", required: true },
      { name: "letter", label: "菲娜的信（門縫下的信）", type: "textarea", optional: true, rows: 5, help: "首頁與故事門口顯示；換行照原樣呈現。有排週次才需要填" },
      { name: "image", label: "封面圖片路徑", type: "text", optional: true, help: "例如 /images/stories/herbal-patch-story.png" },
      { name: "storyContent", label: "故事內容", type: "textarea", required: true, rows: 14, help: "以空行分段" },
      { name: "audioSrc", label: "故事音檔路徑", type: "text", optional: true, help: "例如 /audios/herbal-patch-story.mp3" },
      { name: "magicSubtitleZh", label: "魔法故事屋副標", type: "text", optional: true },
      { name: "magicParagraphsZh", label: "魔法故事屋中文段落", type: "lines", optional: true, rows: 8, help: "一行一段；留空則用上方故事內容分段" },
      { name: "magicParagraphsEn", label: "魔法故事屋英文段落", type: "lines", optional: true, rows: 8, help: "一行一段" },
      { name: "magicImageSrc", label: "魔法故事屋插圖路徑", type: "text", optional: true },
      { name: "magicImageAlt", label: "插圖替代文字", type: "text", optional: true },
      { name: "adventureTitle", label: "小冒險標題", type: "text", required: true },
      { name: "adventureDescription", label: "小冒險說明", type: "textarea", required: true, rows: 4 },
      { name: "craftTitle", label: "自然手作標題", type: "text", required: true },
      { name: "craftDescription", label: "自然手作說明", type: "textarea", required: true, rows: 4 },
      { name: "badgeName", label: "徽章名稱", type: "text", required: true },
      { name: "parentNoteTheme", label: "家長筆記：主題", type: "textarea", required: true, rows: 3 },
      { name: "parentNoteSkills", label: "家長筆記：練習的能力", type: "lines", required: true, rows: 4, help: "一行一項" },
      { name: "parentNoteTalkingPoint", label: "家長筆記：聊天引子", type: "textarea", required: true, rows: 3 },
      sortOrderField,
    ],
  },
  {
    slug: "ingredients",
    label: "材料庫",
    icon: "🌿",
    model: "ingredient",
    idField: "slug",
    description:
      "跨主題共用的材料庫。一個材料可掛在多個主題包（到「主題包」編輯頁掛上／移除），改材料本身所有用到的主題一起更新。app 用「出門引導／拍照提示／用說的問題＋三選項」帶孩子採集。",
    listFields: [
      { name: "slug", label: "Slug" },
      { name: "name", label: "材料" },
      { name: "locationName", label: "採集地點" },
    ],
    fields: [
      { name: "slug", label: "Slug（材料代稱）", type: "text", required: true, readOnlyOnEdit: true, help: "例如 soft-flower，全站唯一，建立後請勿更改" },
      { name: "name", label: "材料名稱", type: "text", required: true },
      { name: "description", label: "材料描述", type: "textarea", required: true, rows: 3 },
      { name: "guide", label: "出門引導", type: "textarea", optional: true, rows: 2, help: "叫孩子在真實世界找什麼、怎麼互動。例：找一朵真的小花，聞一聞——像不像曬過太陽的棉被？" },
      { name: "example", label: "拍照框提示", type: "text", optional: true, help: "例：拍下你找到的花" },
      { name: "question", label: "「用說的」問題", type: "text", optional: true, help: "開放題、沒有標準答案。例：今天最讓你覺得安心的東西是什麼？" },
      { name: "options", label: "三個選項", type: "lines", optional: true, rows: 3, help: "一行一個，正好 3 個；都是對的（對話引子，不是考試）" },
      { name: "locationSlug", label: "採集地點", type: "select", required: true, optionsFrom: { model: "location", value: "slug", label: "name" } },
      { name: "locationName", label: "採集地點顯示名稱", type: "text", required: true, help: "顯示用，例如「草藥花園」" },
      { name: "glyph", label: "圓塊單字", type: "text", optional: true, help: "無照片時的視覺，一個字，例如「花」" },
      { name: "colorSolid", label: "材料主色", type: "text", optional: true, help: "hex，完成畫面/煮湯 token 用，例如 #d97a95" },
      { name: "tile", label: "圖鑑格底色", type: "text", optional: true, help: "hex 色碼，例如 #efc6d2" },
      { name: "gradient", label: "圓塊漸層", type: "text", optional: true, help: "CSS radial-gradient(...)" },
      { name: "scent", label: "香味一句話", type: "text", optional: true, help: "例如「像曬過太陽的棉被」" },
      {
        name: "collection",
        label: "採集挑戰（舊 JSON，選填）",
        type: "json",
        optional: true,
        rows: 10,
        help: "v1 舊欄位，v2 已改用上方「用說的問題＋選項」，可留空。",
      },
    ],
  },
  {
    slug: "theme-books",
    label: "主題書單",
    icon: "📚",
    model: "themeBook",
    idField: "id",
    idIsNumber: true,
    autoId: true,
    description: "主題包推薦的繪本書單。",
    listFields: [
      { name: "themeSlug", label: "主題" },
      { name: "title", label: "書名" },
      { name: "author", label: "作者" },
    ],
    fields: [
      { name: "themeSlug", label: "所屬主題包", type: "select", required: true, optionsFrom: { model: "theme", value: "slug", label: "title" } },
      { name: "title", label: "書名", type: "text", required: true },
      { name: "author", label: "作者", type: "text", required: true },
      { name: "reason", label: "推薦理由", type: "textarea", required: true, rows: 3 },
      sortOrderField,
    ],
  },
  {
    slug: "characters",
    label: "角色",
    icon: "🦊",
    model: "character",
    idField: "slug",
    description: "森林朋友（菲娜、波飛、里洛⋯）。",
    listFields: [
      { name: "slug", label: "Slug" },
      { name: "name", label: "名稱" },
      { name: "nameZh", label: "中文名" },
    ],
    fields: [
      { name: "slug", label: "Slug（網址代稱）", type: "text", required: true, readOnlyOnEdit: true },
      { name: "name", label: "名稱（英）", type: "text", required: true },
      { name: "nameZh", label: "名稱（中）", type: "text", optional: true },
      { name: "tagline", label: "一句話介紹（英）", type: "text", required: true },
      { name: "taglineZh", label: "一句話介紹（中）", type: "text", optional: true },
      { name: "bio", label: "角色介紹（英）", type: "textarea", optional: true, rows: 4 },
      { name: "bioZh", label: "角色介紹（中）", type: "textarea", optional: true, rows: 4 },
      { name: "quote", label: "名言（英）", type: "text", optional: true },
      { name: "quoteZh", label: "名言（中）", type: "text", optional: true },
      { name: "quoteAttribution", label: "名言署名", type: "text", optional: true, help: "例如「— Fina · 菲娜」" },
      { name: "image", label: "圖片路徑", type: "text", optional: true, help: "例如 /images/handoff/fina-bust.png" },
      { name: "locationSlug", label: "住在哪個地點", type: "select", optional: true, optionsFrom: { model: "location", value: "slug", label: "name" } },
      { name: "unlockAtPot", label: "第幾鍋認識", type: "number", optional: true, help: "1-9；朋友們頁依此解鎖。留空＝不在住戶名單" },
      { name: "introLine", label: "認識時的一句補充", type: "text", optional: true, help: "例如「一起煮過湯」" },
      { name: "avatarGradient", label: "頭像底色漸層", type: "text", optional: true, help: "CSS radial-gradient(...)，無照片時使用" },
      sortOrderField,
    ],
  },
  {
    slug: "locations",
    label: "地點",
    icon: "🗺️",
    model: "location",
    idField: "slug",
    description: "森林地圖上的地點（/world）。",
    listFields: [
      { name: "slug", label: "Slug" },
      { name: "name", label: "名稱" },
      { name: "status", label: "狀態" },
    ],
    fields: [
      { name: "slug", label: "Slug（網址代稱）", type: "text", required: true, readOnlyOnEdit: true },
      { name: "name", label: "名稱（中）", type: "text", required: true },
      { name: "nameEn", label: "名稱（英）", type: "text", required: true },
      { name: "emoji", label: "Emoji", type: "text", required: true },
      { name: "tagline", label: "一句話介紹", type: "text", required: true },
      { name: "description", label: "關於這裡", type: "textarea", required: true, rows: 4 },
      { name: "atmosphere", label: "氛圍", type: "textarea", required: true, rows: 4 },
      { name: "image", label: "圖片路徑", type: "text", optional: true },
      {
        name: "status",
        label: "狀態",
        type: "select",
        required: true,
        options: [
          { value: "open", label: "開放中" },
          { value: "coming-soon", label: "即將開放" },
        ],
      },
      { name: "href", label: "自訂連結", type: "text", optional: true, help: "（v1 舊欄位，目前未使用）" },
      { name: "glyph", label: "地圖 pin 單字", type: "text", optional: true, help: "例如「草」「河」「森」" },
      { name: "mapX", label: "地圖 X 座標（%）", type: "number", optional: true, help: "0-100；留空＝不出現在地圖上" },
      { name: "mapY", label: "地圖 Y 座標（%）", type: "number", optional: true, help: "0-100" },
      { name: "unlockAtPot", label: "第幾鍋解鎖", type: "number", optional: true, help: "0＝一開始就亮（我們的家）；1-8 依序點亮；留空＝不在地圖" },
      sortOrderField,
    ],
  },
  {
    slug: "adventures",
    label: "小冒險",
    icon: "🎒",
    model: "adventure",
    idField: "slug",
    description: "森林小冒險完整頁（/adventures）。",
    listFields: [
      { name: "slug", label: "Slug" },
      { name: "title", label: "標題" },
      { name: "location", label: "地點" },
    ],
    fields: [
      { name: "slug", label: "Slug（網址代稱）", type: "text", required: true, readOnlyOnEdit: true },
      { name: "title", label: "標題（中）", type: "text", required: true },
      { name: "titleEn", label: "標題（英）", type: "text", required: true },
      { name: "location", label: "地點（中）", type: "text", required: true },
      { name: "locationEn", label: "地點（英）", type: "text", required: true },
      { name: "character", label: "角色（中）", type: "text", required: true },
      { name: "characterEn", label: "角色（英）", type: "text", required: true },
      { name: "description", label: "任務說明（中）", type: "textarea", required: true, rows: 4 },
      { name: "descriptionEn", label: "任務說明（英）", type: "textarea", required: true, rows: 4 },
      { name: "parentNote", label: "給大人的小提醒", type: "textarea", required: true, rows: 4 },
      { name: "finaQuote", label: "菲娜的開場白", type: "textarea", required: true, rows: 2 },
      { name: "finaResponse", label: "菲娜的完成回應", type: "textarea", required: true, rows: 2 },
      sortOrderField,
    ],
  },
  {
    slug: "todays-adventures",
    label: "今日小冒險卡",
    icon: "🌞",
    model: "todaysAdventure",
    idField: "id",
    description: "首頁「今日森林小冒險」輪播卡片（slug 需對應小冒險）。",
    listFields: [
      { name: "id", label: "ID" },
      { name: "titleZh", label: "標題" },
      { name: "slug", label: "對應冒險" },
    ],
    fields: [
      { name: "id", label: "ID", type: "text", required: true, readOnlyOnEdit: true, help: "例如 adv-1" },
      { name: "slug", label: "對應小冒險", type: "select", required: true, optionsFrom: { model: "adventure", value: "slug", label: "title" } },
      { name: "title", label: "標題（英）", type: "text", required: true },
      { name: "titleZh", label: "標題（中）", type: "text", optional: true },
      { name: "prompt", label: "任務文字（英）", type: "textarea", required: true, rows: 3 },
      { name: "promptZh", label: "任務文字（中）", type: "textarea", optional: true, rows: 3 },
      { name: "narrative", label: "情境敘述（英）", type: "textarea", optional: true, rows: 2 },
      { name: "narrativeZh", label: "情境敘述（中）", type: "textarea", optional: true, rows: 2 },
      { name: "characterName", label: "角色名（英）", type: "text", optional: true },
      { name: "characterNameZh", label: "角色名（中）", type: "text", optional: true },
      { name: "location", label: "地點（英）", type: "text", optional: true },
      { name: "locationZh", label: "地點（中）", type: "text", optional: true },
      sortOrderField,
    ],
  },
  {
    slug: "ambient-texts",
    label: "每日文案",
    icon: "💬",
    model: "ambientText",
    idField: "id",
    idIsNumber: true,
    autoId: true,
    description: "湯湯屋主屋每天輪播的小文案（菲娜狀態、每日提問、Poffy 插話、天氣氛圍）。",
    listFields: [
      { name: "kind", label: "類型" },
      { name: "text", label: "內容" },
    ],
    fields: [
      {
        name: "kind",
        label: "類型",
        type: "select",
        required: true,
        options: [
          { value: "fina-activity", label: "菲娜今天的狀態" },
          { value: "daily-question", label: "菲娜想問你的問題" },
          { value: "poffy-quote", label: "Poffy 插話" },
          { value: "weather-mood", label: "天氣／氛圍標籤" },
        ],
      },
      { name: "text", label: "內容", type: "textarea", required: true, rows: 3 },
      sortOrderField,
    ],
  },
];

export function getAdminEntity(slug: string): AdminEntity | undefined {
  return adminEntities.find((e) => e.slug === slug);
}
