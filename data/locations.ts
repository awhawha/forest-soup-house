/**
 * Forest Soup House — Locations in the forest (World map + /world/[slug]).
 */

export interface Location {
  slug: string;
  name: string;
  nameEn: string;
  emoji: string;
  tagline: string;
  description: string;
  atmosphere: string;
  image?: string;
  status: "open" | "coming-soon";
  /** 若設定，地圖卡片會連到此路徑，而非預設的 `/world/[slug]`（例：主屋 → 故事時間） */
  href?: string;
}

export const locations: Location[] = [
  {
    slug: "soup-house",
    name: "湯湯屋主屋",
    nameEn: "The Forest Soup House",
    /** 主屋入口：進入故事時間（與導覽「故事時間」同一頁） */
    href: "/stories",
    emoji: "🏠",
    tagline: "魔法湯在這裡誕生，充滿香氣與美味。",
    description:
      "推開木門，湯與香草交織的氣味會先向你打招呼；鍋子裡輕輕冒泡，每一匙都像一個小小的故事開場。這裡是菲娜和朋友們聚首的地方，也是許多冒險心意的起點。",
    atmosphere:
      "溫暖、忙碌卻不匆忙；陽光從窗縫灑在木桌上，適合和家人一起圍著，聽見湯湯屋裡的歡笑與細語，讓時間變得柔軟。",
    status: "open",
  },
  {
    slug: "herbal-patch",
    name: "草藥花園",
    nameEn: "Herbal Patch",
    emoji: "🌿",
    tagline: "一座充滿香氣的花園，草本會悄悄告訴你它們的秘密。",
    description:
      "小徑兩旁是會悄悄搖曳的草藥花，風一吹，香氣像在和小朋友玩捉迷藏；有時一片葉子會輕輕落在你手心，彷彿在說「你好呀」。",
    atmosphere:
      "明亮而柔和，泥土與花香混在一起，讓人想放慢腳步，用鼻子和指尖去認識每一株植物，像在讀一本會呼吸的書。",
    status: "open",
  },
  {
    slug: "whisper-shed",
    name: "悄悄耳語小屋",
    nameEn: "Whisper Shed",
    emoji: "🌙",
    tagline: "寫下你的心事，森林會幫你保管。",
    description:
      "小屋裡有一本厚厚的冊子，等你寫下心事；墨水乾了以後，字跡會變成森林裡一縷幾乎聽不見的風聲，只屬於你和紙筆。",
    atmosphere:
      "安靜、被包覆的感覺，像躲進樹洞裡；月光從窗框灑進來時，連呼吸都會變得輕一點。",
    status: "coming-soon",
  },
  {
    slug: "brewing-shed",
    name: "熟成室",
    nameEn: "The Brewing Shed",
    emoji: "🧪",
    tagline: "藤蔓後方的秘密小屋，只在特定時刻開啟。",
    description:
      "藤蔓後面藏著一間只會在特定時刻亮起燈的小屋，傳說裡，湯在這裡慢慢熟成，時間也變得黏稠而香甜，像蜂蜜在勺子裡打轉。",
    atmosphere:
      "神秘、略帶期待的靜謐，彷彿下一秒門就會為某個節慶或約定而打開；空氣裡有微微發酵的甜香。",
    status: "coming-soon",
  },
  {
    slug: "ingredient-woods",
    name: "湯料森林",
    nameEn: "The Ingredient Woods",
    emoji: "🌲",
    tagline: "沿路蒐集今日的任務湯料。",
    description:
      "樹影之間藏著當日冒險需要的線索與湯料，撿起一片葉、一顆果實，背包就會變得輕輕響，像在和森林交換小秘密。",
    atmosphere:
      "充滿小驚喜的林間步道，光斑在腳邊跳躍，適合邊走邊收集、邊猜下一個轉角會遇見什麼；風會把下一個提示吹到你耳邊。",
    status: "coming-soon",
  },
  {
    slug: "character-grove",
    name: "角色角",
    nameEn: "Character Grove",
    emoji: "🦊",
    tagline: "菲娜和朋友們住在這裡，隨時歡迎你來。",
    description:
      "這裡是小動物們的家門口，門牌上可能寫著菲娜、波飛或里洛的名字；有時門簾一掀，就會探出一張毛茸茸的笑臉，邀你進來坐一坐。",
    atmosphere:
      "親切、熱鬧卻不吵鬧，像鄰居互相拜訪的下午；草地上可能還留著剛剛玩過遊戲的腳印與笑聲。",
    status: "coming-soon",
  },
  {
    slug: "soup-lore-stone",
    name: "魔法湯譜石",
    nameEn: "Stone of Soup Lore",
    emoji: "🪨",
    tagline: "古老的記憶之地，每完成一個故事就會亮起。",
    description:
      "古老的石面上刻著模糊的紋路，每當你在故事裡完成一段旅程，石頭就會多亮起一點溫柔的光，像星星被湯湯屋記住了。",
    atmosphere:
      "莊重又溫柔，帶一點儀式感，像在森林的心臟處，悄悄記下你與湯湯屋的回憶；適合停下來，把手掌貼在石面上感受餘溫。",
    status: "coming-soon",
  },
  {
    slug: "forest-post",
    name: "森林郵局",
    nameEn: "Forest Post",
    emoji: "📮",
    tagline: "投入你的心意，等待森林的回信。",
    description:
      "木製信箱立在岔路口，你可以把畫好的卡片、摺好的紙飛機投進去，據說森林會用風、落葉或夢境回信，把想念送到對的地方。",
    atmosphere:
      "期待與盼望交織的小角落，適合許願，也適合把來不及說出口的話交給樹影帶走；腳步會不自覺放輕。",
    status: "coming-soon",
  },
  {
    slug: "soupling-stream",
    name: "湯湯小河",
    nameEn: "Soupling Stream",
    emoji: "💧",
    tagline: "小河邊藏著漂來的湯料和驚喜。",
    description:
      "河水淺淺地流，有時會漂來小木片、花瓣或閃閃發亮的小湯料，撈起來就像收到河流送的禮物，手心會留下一點涼涼的快樂。",
    atmosphere:
      "涼爽、水聲潺潺，石頭上長著青苔，最適合蹲下來觀察水面，猜下一個波浪會帶來什麼；蜻蜓偶爾點水，像幫你打拍子。",
    status: "coming-soon",
  },
  {
    slug: "observation-post",
    name: "森林觀察站",
    nameEn: "Forest Observation Post",
    emoji: "🔭",
    tagline: "每次冒險開始前，從這裡拿到你的今日線索。",
    description:
      "小木梯通往略高的平台，從這裡可以望見森林的輪廓與今日雲的形狀；牆上掛著簡單的線索卡，提醒你冒險從哪裡開始、心要帶往哪裡去。",
    atmosphere:
      "開闊又安心，像故事開場前深呼吸的地方；風吹過耳邊時，彷彿有人在輕聲說「出發吧」，卻一點也不著急。",
    status: "coming-soon",
  },
];
