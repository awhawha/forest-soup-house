/**
 * Homepage — Today's Little Adventures cards (preview copy).
 * Each `slug` matches `data/adventures.ts` for deep links to `/adventures/[slug]`.
 */

export interface TodaysAdventure {
  id: string;
  /** Same slug as full adventure page */
  slug: string;
  title: string;
  titleZh?: string;
  prompt: string;
  promptZh?: string;
  narrative?: string;
  narrativeZh?: string;
  characterName?: string;
  characterNameZh?: string;
  location?: string;
  locationZh?: string;
}

export const todaysAdventures: TodaysAdventure[] = [
  {
    id: "adv-1",
    slug: "find-a-forest-smell",
    title: "Find a forest smell",
    titleZh: "找一個森林的味道",
    prompt:
      "With your grown-up, find something outside that smells like the forest. It might be a leaf, a flower, or the air after rain. Tell each other what it reminds you of.",
    promptZh:
      "和大人在戶外找一個聞起來像森林的東西。可能是葉子、花，或是雨後的空氣。互相說說它讓你想起什麼。",
    narrative: "The forest is full of small smells today. Something is waiting for you to notice.",
    narrativeZh: "今天的森林裡，藏著許多小小的氣味。有什麼正等你去發現。",
    characterName: "Fina",
    characterNameZh: "菲娜",
    location: "the Soup House path",
    locationZh: "湯湯屋小徑",
  },
  {
    id: "adv-2",
    slug: "share-a-soup-story",
    title: "Share a soup story",
    titleZh: "分享一個湯的故事",
    prompt:
      "Think of a time when you had soup (or something warm in a bowl). Tell your grown-up about it. What did it smell like? Who were you with?",
    promptZh:
      "想一想你曾經喝湯（或任何一碗溫暖的食物）的時刻。跟大人說說：聞起來是什麼味道？你和誰在一起？",
    narrative: "Fina is waiting by the Soup House. She has something warm to share.",
    narrativeZh: "菲娜在湯湯屋旁邊等你。她有一份溫暖想和你分享。",
    characterName: "Fina",
    characterNameZh: "菲娜",
    location: "the Soup House",
    locationZh: "湯湯屋",
  },
  {
    id: "adv-3",
    slug: "one-ingredient-of-the-day",
    title: "One ingredient of the day",
    titleZh: "今日的一味材料",
    prompt:
      "Pick one thing you see today that could go in a magic soup. It could be a color, a sound, or a feeling. Tell your grown-up why you chose it.",
    promptZh:
      "從今天看見的事物裡，挑一樣可以放進魔法湯裡的東西。可以是顏色、聲音，或一種感覺。跟大人說說你為什麼選它。",
    narrative: "Poffy is stirring something that smells like morning. What would you add?",
    narrativeZh: "波飛正在攪拌聞起來像早晨的東西。你想加什麼？",
    characterName: "Poffy",
    characterNameZh: "波飛",
    location: "the Whisper Shed",
    locationZh: "悄悄耳語小屋",
  },
];
