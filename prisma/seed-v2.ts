/**
 * v2 seed — 週更親子體驗版新內容（可重複執行）。
 * 補上：地圖 pin 資料、9 位住戶、材料視覺、10 週主線、湯鍋食譜、當週設定。
 * 執行：npx tsx prisma/seed-v2.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── 森林地圖 9 個 pin（座標/解鎖順序來自設計稿）──
const MAP_PINS: Record<
  string,
  { glyph: string; x: number; y: number; unlockAtPot: number; tagline?: string; description?: string }
> = {
  "soup-house": {
    glyph: "屋", x: 50, y: 84, unlockAtPot: 0,
  },
  "observation-post": {
    glyph: "望", x: 80, y: 76, unlockAtPot: 1,
    description:
      "小木梯通往略高的平台，從這裡可以望見森林的輪廓與今日雲的形狀。旅程的第一個角落，就是從這裡看出去的。",
  },
  "herbal-patch": {
    glyph: "草", x: 24, y: 28, unlockAtPot: 2,
    description:
      "小徑兩旁是會悄悄搖曳的草藥花，風一吹，香氣像在和小朋友玩捉迷藏。這裡的花，要親手曬過才會變成湯料。",
  },
  "ingredient-woods": {
    glyph: "森", x: 74, y: 24, unlockAtPot: 3,
    description:
      "樹影之間藏著當週需要的線索與湯料，撿起一片葉、一顆果實，背包就會變得輕輕響。",
  },
  "brewing-shed": {
    glyph: "釀", x: 58, y: 52, unlockAtPot: 4,
    description:
      "藤蔓後面藏著一間只會在特定時刻亮起燈的小屋，湯在這裡慢慢熟成，時間也變得黏稠而香甜。放進去的湯，要等到隔天才會好。",
  },
  "soupling-stream": {
    glyph: "河", x: 42, y: 40, unlockAtPot: 5,
    description:
      "河水淺淺地流，有時會漂來小木片、花瓣或閃閃發亮的小湯料，撈起來就像收到河流送的禮物。",
  },
  "whisper-shed": {
    glyph: "語", x: 15, y: 60, unlockAtPot: 6,
    description:
      "小屋裡有一本厚厚的冊子，等你說出心事；字跡會變成森林裡一縷幾乎聽不見的風聲，只屬於你。",
  },
  "forest-post": {
    glyph: "郵", x: 85, y: 58, unlockAtPot: 7,
    description:
      "木製信箱立在岔路口，把畫好的卡片投進去，森林會用風、落葉或夢境回信。寄出去的信，過幾天才會收到回音。",
  },
  "character-grove": {
    glyph: "家", x: 28, y: 72, unlockAtPot: 8,
    description:
      "這裡是小動物們的家門口，門牌上寫著朋友們的名字；有時門簾一掀，就會探出一張毛茸茸的笑臉。最後一鍋湯，大家會在這裡集合。",
  },
  // soup-lore-stone 不是地圖 pin（湯譜石＝首頁進度石），不設座標
};

// ── 9 位住戶（朋友們頁；資料來自設計稿）──
interface ResidentSeed {
  slug: string;
  nameZh: string;
  name: string;
  kind: string; // taglineZh
  desc: string; // bioZh
  quote: string; // quoteZh
  introLine: string; // 認識時的一句補充
  locationSlug: string;
  unlockAtPot: number;
  gradient: string;
  image?: string;
}

const RESIDENTS: ResidentSeed[] = [
  {
    slug: "fina", nameZh: "菲娜", name: "Fina",
    kind: "小狐狸 · 住在湯湯屋",
    desc: "愛喝湯、愛問問題的好奇小狐狸，喜歡聞香草的味道。",
    quote: "湯，要分享才最好喝。",
    introLine: "一起煮過湯",
    locationSlug: "soup-house", unlockAtPot: 1,
    gradient: "radial-gradient(circle at 40% 35%,#ffe9c4,#f3cf92)",
    image: "/images/handoff/fina-bust.png",
  },
  {
    slug: "poffy", nameZh: "波飛", name: "Poffy",
    kind: "火爐精靈 · 看守熟成室",
    desc: "攪動湯鍋、讓大家都暖和的魔法小幫手。",
    quote: "熱湯要小心，涼了就少了一半魔法。",
    introLine: "你告訴過他一個涼涼的記憶",
    locationSlug: "brewing-shed", unlockAtPot: 1,
    gradient: "radial-gradient(circle at 40% 35%,#f0b45a,#d9733a)",
  },
  {
    slug: "meelo", nameZh: "Meelo 貓頭鷹", name: "Meelo",
    kind: "守夜者 · 森林觀察站",
    desc: "總在冒險開始前，把今天的線索輕輕交到你手上。",
    quote: "看得夠遠，才知道往哪裡走。",
    introLine: "給了你第一個線索",
    locationSlug: "observation-post", unlockAtPot: 1,
    gradient: "radial-gradient(circle at 40% 35%,#b9a7cf,#7a6a95)",
  },
  {
    slug: "milo", nameZh: "Milo 小松鼠", name: "Milo",
    kind: "香味收藏家 · 草藥花園",
    desc: "鼻子最靈的小松鼠，會把最香的花藏在最難找的地方。",
    quote: "這個味道，我可是找了一整個下午！",
    introLine: "",
    locationSlug: "herbal-patch", unlockAtPot: 2,
    gradient: "radial-gradient(circle at 40% 35%,#d9a86a,#a5713a)",
  },
  {
    slug: "lilo", nameZh: "里洛", name: "Lilo",
    kind: "材料守護者 · 湯料森林",
    desc: "最愛認識每一種香氣，會在森林裡藏謎語等你。",
    quote: "每一片葉子，都記得自己來的地方。",
    introLine: "你猜對了他的麵包謎語",
    locationSlug: "ingredient-woods", unlockAtPot: 3,
    gradient: "radial-gradient(circle at 40% 35%,#8cc47e,#4f8a52)",
  },
  {
    slug: "shimmer", nameZh: "微光", name: "Shimmer",
    kind: "河流精靈 · 湯湯小河",
    desc: "順著水漂來漂去，把閃亮的小東西送到你手邊。",
    quote: "撿到的，都是河流想送你的。",
    introLine: "",
    locationSlug: "soupling-stream", unlockAtPot: 5,
    gradient: "radial-gradient(circle at 40% 35%,#7fb0c9,#4a7f95)",
  },
  {
    slug: "pon-pon", nameZh: "蓬蓬", name: "Pon-pon",
    kind: "遠方的旅人 · 悄悄耳語小屋",
    desc: "從很遠的地方來，話不多，卻很會聽別人的心事。",
    quote: "說出來，就沒那麼重了。",
    introLine: "",
    locationSlug: "whisper-shed", unlockAtPot: 6,
    gradient: "radial-gradient(circle at 40% 35%,#c9b89a,#8f7a5a)",
  },
  {
    slug: "pipit", nameZh: "Pipit 小鳥", name: "Pipit",
    kind: "森林郵差 · 森林郵局",
    desc: "負責把你的心意送出去，也把森林的回信帶回來。",
    quote: "你的信，我一定準時送到。",
    introLine: "",
    locationSlug: "forest-post", unlockAtPot: 7,
    gradient: "radial-gradient(circle at 40% 35%,#e0a860,#b5763a)",
  },
  {
    slug: "little-pu", nameZh: "小噗", name: "Little Pu",
    kind: "見習廚助 · 角色角",
    desc: "手忙腳亂但超級努力的小廚助，最愛在慶祝會上端湯。",
    quote: "我、我沒有打翻！只是湯太興奮了！",
    introLine: "",
    locationSlug: "character-grove", unlockAtPot: 8,
    gradient: "radial-gradient(circle at 40% 35%,#f0a860,#c9793a)",
  },
];

// ── 材料視覺（glyph / 圖鑑底色 / 圓塊漸層 / 香味一句話）──
// key = Ingredient.slug（材料庫全域唯一）
const ING_VISUALS: Record<
  string,
  { glyph: string; tile: string; gradient: string; scent: string }
> = {
  // W1 記憶中的香香湯（沿用設計稿）
  "soft-flower": { glyph: "花", tile: "#efc6d2", gradient: "radial-gradient(circle at 40% 35%,#f0b8c8,#d97a95)", scent: "像曬過太陽的棉被" },
  "bread-chunk": { glyph: "包", tile: "#e6c187", gradient: "radial-gradient(circle at 40% 35%,#e8c887,#c99a4a)", scent: "剛起床的味道" },
  "cloud-icecream": { glyph: "甜", tile: "#c3d6e2", gradient: "radial-gradient(circle at 40% 35%,#bcd4e4,#7fa8c4)", scent: "最喜歡的味道" },
  // W2 香味怎麼來的？
  "wake-leaf": { glyph: "葉", tile: "#cfe0bc", gradient: "radial-gradient(circle at 40% 35%,#b8d49a,#7ba55c)", scent: "草地打招呼的味道" },
  "sun-dried-candy": { glyph: "糖", tile: "#f2dfae", gradient: "radial-gradient(circle at 40% 35%,#f0d98a,#d9a94a)", scent: "夏天微笑的味道" },
  "cool-mint": { glyph: "荷", tile: "#c9e2dc", gradient: "radial-gradient(circle at 40% 35%,#a8d4c8,#5f9a8c)", scent: "呼～涼涼的風" },
  // W3 魔法湯譜初現
  "red-fruit": { glyph: "果", tile: "#f0c2b5", gradient: "radial-gradient(circle at 40% 35%,#f0a890,#d9694a)", scent: "暖呼呼的太陽味" },
  "mint-leaf": { glyph: "荷", tile: "#c9e2d2", gradient: "radial-gradient(circle at 40% 35%,#a8d4b8,#5f9a74)", scent: "深呼吸的味道" },
  "warm-ginger": { glyph: "薑", tile: "#f0d5ae", gradient: "radial-gradient(circle at 40% 35%,#f0c287,#d9924a)", scent: "被抱住的溫暖" },
  // W4 神秘的夜光湯
  "night-flower": { glyph: "夜", tile: "#d9d2e8", gradient: "radial-gradient(circle at 40% 35%,#c5b5df,#8a76b5)", scent: "黑暗裡的小光" },
  "moon-leaf": { glyph: "月", tile: "#c9d5e8", gradient: "radial-gradient(circle at 40% 35%,#aac2df,#6a87b5)", scent: "月亮的清清香" },
  "night-symbol": { glyph: "符", tile: "#cdc2df", gradient: "radial-gradient(circle at 40% 35%,#b5a5d4,#7a659f)", scent: "神秘的微光" },
  // W5 湯湯屋的節慶湯
  "sun-fruit": { glyph: "陽", tile: "#f2d5a5", gradient: "radial-gradient(circle at 40% 35%,#f0c46a,#d9903a)", scent: "家的溫暖味道" },
  "dancing-flower": { glyph: "舞", tile: "#efc6d9", gradient: "radial-gradient(circle at 40% 35%,#f0b8d4,#d97aa8)", scent: "會跳舞的花香" },
  "smile-spice": { glyph: "笑", tile: "#f2e3ae", gradient: "radial-gradient(circle at 40% 35%,#f0dc87,#d9b44a)", scent: "讓人笑出來的香料" },
  // W6 會唱歌的薄荷
  "singing-mint": { glyph: "唱", tile: "#c9e2d2", gradient: "radial-gradient(circle at 40% 35%,#9ed4b4,#549a6f)", scent: "叮…風鈴般的聲音" },
  "dancing-thyme": { glyph: "草", tile: "#d5e2b8", gradient: "radial-gradient(circle at 40% 35%,#c2d494,#87a54f)", scent: "有節奏的草香" },
  "quiet-drop": { glyph: "露", tile: "#c9dde8", gradient: "radial-gradient(circle at 40% 35%,#a8ccdf,#5f8fb5)", scent: "清晨安靜的味道" },
  // W7 迷路的蜂蜜葉
  "honey-leaf": { glyph: "蜜", tile: "#f2dfa5", gradient: "radial-gradient(circle at 40% 35%,#f0d46a,#d9a43a)", scent: "最甜最溫暖的氣息" },
  "stinky-mushroom": { glyph: "菇", tile: "#d9c9b5", gradient: "radial-gradient(circle at 40% 35%,#c4a887,#8f6f4a)", scent: "咦？好臭的陷阱！" },
  "real-sweet": { glyph: "甜", tile: "#efd0c6", gradient: "radial-gradient(circle at 40% 35%,#f0b8a8,#d9836a)", scent: "專心找到的真正的甜" },
  // W8 石頭的秘密
  "soup-seed": { glyph: "種", tile: "#f2e8c2", gradient: "radial-gradient(circle at 40% 35%,#f0e0a0,#d9b85a)", scent: "沉睡的金色光" },
  "guardian-stone": { glyph: "石", tile: "#d5d5cd", gradient: "radial-gradient(circle at 40% 35%,#c2c2b8,#8a8a7a)", scent: "涼涼的古老氣息" },
  "story-record": { glyph: "譜", tile: "#e8ddc2", gradient: "radial-gradient(circle at 40% 35%,#dfc9a0,#b59a5f)", scent: "紙頁與墨水的味道" },
  // W9 風中的香囊
  "surprise-leaf": { glyph: "驚", tile: "#cfe0cc", gradient: "radial-gradient(circle at 40% 35%,#b8d4b0,#7ba574)", scent: "每一口都不一樣" },
  "scent-bag": { glyph: "囊", tile: "#f0d0ae", gradient: "radial-gradient(circle at 40% 35%,#f0bc87,#d98a4a)", scent: "好多花香混在一起" },
  "sneeze-cloud": { glyph: "雲", tile: "#e2e2dd", gradient: "radial-gradient(circle at 40% 35%,#d4d4cc,#9a9a8c)", scent: "哈啾！淘氣的煙霧" },
  // W10 湯湯屋大冒險
  "best-memory": { glyph: "憶", tile: "#f0d5c2", gradient: "radial-gradient(circle at 40% 35%,#f0c2a0,#d98f5f)", scent: "你最記得的味道" },
  "journey-herb": { glyph: "旅", tile: "#d5e2c2", gradient: "radial-gradient(circle at 40% 35%,#c2d4a0,#87a55f)", scent: "一路走來的味道" },
  "shared-story": { glyph: "事", tile: "#efd0b5", gradient: "radial-gradient(circle at 40% 35%,#f0b887,#d9854a)", scent: "大家一起的味道" },
};

// ── 10 週主線：themeSlug 依主題包排序；菲娜的信 ──
const WEEK_LETTERS: { themeSlug: string; letter: string }[] = [
  {
    themeSlug: "memory-soup",
    letter:
      "今天早上，湯的香味變淡了。\n我需要三樣材料——有的在森林裡，有的就藏在你家附近。\n帶上你的鼻子，我們一起把香味找回來。",
  },
  {
    themeSlug: "awakening-soup",
    letter:
      "早上我把湯鍋端到窗邊，想再聞一次昨天的香味。\n可是——香味到底是從哪裡來的呢？\n需要三樣材料，跟我一起去找答案。",
  },
  {
    themeSlug: "brave-soup",
    letter:
      "櫃子最高的架子上，掉下來一本奶奶留下的魔法湯譜。\n第一頁寫著：勇氣湯。\n有一位小田鼠朋友很需要它——幫我找齊三樣材料好嗎？",
  },
  {
    themeSlug: "night-glow-soup",
    letter:
      "昨天半夜，湯鍋自己發光了！\n藍藍的、像螢火蟲一樣。\n我需要三樣會發亮的東西，天黑以後一起去找。",
  },
  {
    themeSlug: "festival-soup",
    letter:
      "今天是一年一度的「大家一起煮湯節」！\n每個朋友都會帶一樣自己的味道來。\n你也帶三樣來好嗎？",
  },
  {
    themeSlug: "fresh-soup",
    letter:
      "花園今天好吵，Milo 的耳朵都豎起來了。\n聽說有一種薄荷會唱歌，能讓吵雜變安靜。\n幫我找三樣安靜的材料。",
  },
  {
    themeSlug: "honey-soup",
    letter:
      "不好了！Milo 的蜂蜜葉被風吹走了。\n採蜜節快到了，我們得用鼻子把它找回來。\n小心，森林裡有香氣陷阱。",
  },
  {
    themeSlug: "seed-soup",
    letter:
      "森林入口的大石頭裂開了一條縫，裡面透出光。\nMeelo 說，那是森林第一碗湯的種子。\n找齊三樣材料，我們去喚醒它。",
  },
  {
    themeSlug: "surprise-soup",
    letter:
      "風送來了一個繡著奇特圖案的香囊。\n打開之前，誰也不知道裡面裝著什麼。\n帶三樣材料來，我們一起拆開它。",
  },
  {
    themeSlug: "adventure-soup",
    letter:
      "大家都回來了！這是我們的最後一鍋湯。\n把你最記得的味道帶回來，\n我們要把整段旅程一起煮進去。",
  },
];

// ── 湯鍋「找到的食譜」──
const POT_RECIPES = [
  {
    slug: "sunrise-orange",
    name: "蜜柑暖暖湯",
    ingredientSlugs: ["bread-chunk", "cloud-icecream"],
    image: "/images/handoff/orange-card.png",
    flavorText: "酸酸甜甜，喝起來像冬天早晨的太陽。",
    sortOrder: 0,
  },
  {
    slug: "moonlight-mushroom",
    name: "月光菇菇湯",
    ingredientSlugs: ["soft-flower", "cloud-icecream", "night-flower"],
    image: null,
    flavorText: "——夜光花要到夜光湯那一週才找得到",
    sortOrder: 1,
  },
  {
    slug: "honey-morning",
    name: "蜂蜜早晨湯",
    ingredientSlugs: ["bread-chunk", "honey-leaf"],
    image: null,
    flavorText: "——蜂蜜葉藏在採蜜節那一週的森林裡",
    sortOrder: 2,
  },
];

async function main() {
  // 1. 地圖 pin
  for (const [slug, pin] of Object.entries(MAP_PINS)) {
    await prisma.location.update({
      where: { slug },
      data: {
        glyph: pin.glyph,
        mapX: pin.x,
        mapY: pin.y,
        unlockAtPot: pin.unlockAtPot,
        ...(pin.description ? { description: pin.description } : {}),
      },
    });
  }
  console.log(`✓ 地圖 pin ${Object.keys(MAP_PINS).length} 筆`);

  // 2. 住戶
  for (const [i, r] of RESIDENTS.entries()) {
    const data = {
      name: r.name,
      nameZh: r.nameZh,
      tagline: r.kind,
      taglineZh: r.kind,
      bioZh: r.desc,
      quoteZh: r.quote,
      introLine: r.introLine || null,
      locationSlug: r.locationSlug,
      unlockAtPot: r.unlockAtPot,
      avatarGradient: r.gradient,
      ...(r.image ? { image: r.image } : {}),
      sortOrder: i,
    };
    await prisma.character.upsert({
      where: { slug: r.slug },
      create: { slug: r.slug, ...data, bio: r.desc },
      update: data,
    });
  }
  console.log(`✓ 住戶 ${RESIDENTS.length} 位`);

  // 3. 材料視覺（材料改成材料庫共用 → 寫進 Ingredient）
  let ingCount = 0;
  for (const [slug, v] of Object.entries(ING_VISUALS)) {
    const res = await prisma.ingredient.updateMany({
      where: { slug },
      data: { glyph: v.glyph, tile: v.tile, gradient: v.gradient, scent: v.scent },
    });
    ingCount += res.count;
  }
  console.log(`✓ 材料視覺 ${ingCount} 筆`);

  // 4. 週主線：把週次與菲娜的信寫進對應主題包（主題包 = 一週 = 一碗湯）
  for (const [i, w] of WEEK_LETTERS.entries()) {
    await prisma.theme.update({
      where: { slug: w.themeSlug },
      data: { weekNumber: i + 1, letter: w.letter },
    });
  }
  console.log(`✓ 週主線 ${WEEK_LETTERS.length} 週（寫進主題包 weekNumber/letter）`);

  // 5. 湯鍋食譜
  for (const r of POT_RECIPES) {
    const { slug, ...rest } = r;
    await prisma.potRecipe.upsert({
      where: { slug },
      create: { slug, ...rest },
      update: rest,
    });
  }
  console.log(`✓ 湯鍋食譜 ${POT_RECIPES.length} 筆`);

  // 6. 當週設定
  await prisma.setting.upsert({
    where: { key: "currentWeek" },
    create: { key: "currentWeek", value: "1" },
    update: {},
  });
  console.log("✓ 當週設定 currentWeek=1（已存在則不覆蓋）");

  console.log("\nv2 內容就緒 🍲");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
