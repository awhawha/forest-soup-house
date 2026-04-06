/**
 * Forest Soup House — Little Adventures (full pages)
 * List + detail: /adventures, /adventures/[slug]
 */

export interface Adventure {
  slug: string;
  location: string;
  locationEn: string;
  character: string;
  characterEn: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  parentNote: string;
  finaQuote: string;
  finaResponse: string;
}

export const adventures: Adventure[] = [
  {
    slug: "find-a-forest-smell",
    location: "湯湯屋小徑",
    locationEn: "Soup House path",
    character: "菲娜",
    characterEn: "Fina",
    title: "找一個森林的味道",
    titleEn: "Find a forest smell",
    description:
      "和大人在戶外找一個聞起來像森林的東西。可能是葉子、花，或是雨後的空氣。互相說說它讓你想起什麼。",
    descriptionEn:
      "With your grown-up, find something outside that smells like the forest. It might be a leaf, a flower, or the air after rain. Tell each other what it reminds you of.",
    parentNote:
      "嗅覺是孩子最早發展的感官之一，也是記憶連結最強的通道。這個任務沒有標準答案——重點是讓孩子說出自己的感受，大人也可以分享自己的聯想。",
    finaQuote: "今天的森林裡，藏著許多小小的氣味。有什麼正等你去發現。",
    finaResponse: "你找到了！那個味道會一直住在你的記憶裡。",
  },
  {
    slug: "share-a-soup-story",
    location: "湯湯屋",
    locationEn: "Soup House",
    character: "菲娜",
    characterEn: "Fina",
    title: "分享一個湯的故事",
    titleEn: "Share a soup story",
    description:
      "想一想你曾經喝湯（或任何一碗溫暖的食物）的時刻。跟大人說說：聞起來是什麼味道？你和誰在一起？",
    descriptionEn:
      "Think of a time when you had soup (or something warm in a bowl). Tell your grown-up about it. What did it smell like? Who were you with?",
    parentNote:
      "回憶食物的故事是親子之間很自然的連結方式。孩子說的時候，大人可以跟著問：那個人現在在哪裡？你還想吃嗎？讓對話多走一步。",
    finaQuote: "菲娜在湯湯屋旁邊等你。她有一份溫暖想和你分享。",
    finaResponse: "謝謝你告訴我這個故事。每一碗湯裡都有一個人。",
  },
  {
    slug: "one-ingredient-of-the-day",
    location: "悄悄耳語小屋",
    locationEn: "Whisper Shed",
    character: "波飛",
    characterEn: "Poffy",
    title: "今日的一味材料",
    titleEn: "One ingredient of the day",
    description:
      "從今天看見的事物裡，挑一樣可以放進魔法湯裡的東西。可以是顏色、聲音，或一種感覺。跟大人說說你為什麼選它。",
    descriptionEn:
      "Pick one thing you see today that could go in a magic soup. It could be a color, a sound, or a feeling. Tell your grown-up why you chose it.",
    parentNote:
      "這個任務練習的是「命名感受」——孩子把抽象的感覺轉化成具體的語言。大人可以跟著問：如果這個材料放進湯裡，湯會變成什麼顏色？",
    finaQuote: "波飛正在攪拌聞起來像早晨的東西。你想加什麼？",
    finaResponse: "你選的材料放進去了。這鍋湯現在有一點你的味道。",
  },
];

export function getAdventureBySlug(slug: string): Adventure | undefined {
  return adventures.find((a) => a.slug === slug);
}
