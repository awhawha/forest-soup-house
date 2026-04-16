/**
 * Forest Soup House — Characters
 * Types and data for forest friends. Fina has a full profile; others can be card-only for v1.
 */

export interface Character {
  slug: string;
  name: string;
  nameZh?: string;
  tagline: string;
  taglineZh?: string;
  bio?: string;
  bioZh?: string;
  quote?: string;
  quoteZh?: string;
  quoteAttribution?: string;
  image?: string;
  links?: { label: string; href: string }[];
}

export const characters: Character[] = [
  {
    slug: "fina",
    name: "Fina",
    nameZh: "菲娜",
    tagline: "Curious fox who loves soup and asks the best questions.",
    taglineZh: "愛喝湯、愛問問題的好奇小狐狸。",
    bio: "Fina is a curious fox who lives in the forest. She loves to smell the herbs in the Soup House and ask Poffy what's in the pot. When she's not exploring, she likes to sit by the fire and listen to stories.",
    bioZh: "菲娜是一隻住在森林裡的好奇小狐狸。她喜歡在湯湯屋聞香草的味道，也愛問波飛鍋裡裝的是什麼。不去探險的時候，她會坐在火堆旁聽故事。",
    quote: "Soup is best when you share it.",
    quoteZh: "湯，要分享才最好喝。",
    quoteAttribution: "— Fina · 菲娜",
    image: "/images/characters/fina.png",
    links: [
      { label: "Read a story with Fina", href: "/stories" },
      { label: "Visit the Soup House", href: "/world" },
    ],
  },
  {
    slug: "poffy",
    name: "Poffy",
    nameZh: "波飛",
    tagline: "Magical helper who stirs the pot and keeps everyone warm.",
    taglineZh: "攪動湯鍋、讓大家都暖和的魔法小幫手。",
    image: "/images/characters/poffy.png",
  },
  {
    slug: "lilo",
    name: "Lilo",
    nameZh: "里洛",
    tagline: "Guardian of ingredients. Loves to experiment in the Soup Magic Lab.",
    taglineZh: "材料守護者，最愛在湯湯魔法實驗室裡搗鼓新配方。",
    image: "/images/characters/lilo.png",
  },
];
