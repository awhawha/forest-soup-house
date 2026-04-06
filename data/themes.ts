export interface CollectionChallengeChoice {
  type: "choice";
  prompt: string;
  options: { text: string; finaResponse: string }[];
}

export interface CollectionChallengeRiddle {
  type: "riddle";
  prompt: string;
  riddle: {
    question: string;
    /** 使用者答案包含此關鍵字即算對 */
    answer: string;
    hint: string;
    finaResponse: string;
  };
}

export interface CollectionChallengeSecret {
  type: "secret";
  prompt: string;
  secret: {
    placeholder: string;
    finaResponse: string;
  };
}

export type CollectionChallenge =
  | CollectionChallengeChoice
  | CollectionChallengeRiddle
  | CollectionChallengeSecret;

export interface ThemeIngredient {
  slug: string;
  name: string;
  description: string;
  locationSlug: string;
  locationName: string;
  collection: CollectionChallenge;
}

export interface ThemeBook {
  title: string;
  author: string;
  reason: string;
}

export interface Theme {
  slug: string;
  title: string;
  tagline: string;
  soupSlug: string;
  /** 長篇全文（選填，若只在魔法故事屋呈現則可省略） */
  storyContent?: string;
  /** 魔法故事屋：音檔 + 插圖 + 雙語摘要 */
  audioSrc?: string;
  magicSubtitleZh?: string;
  magicParagraphsZh?: string[];
  magicParagraphsEn?: string[];
  magicImageSrc?: string;
  magicImageAlt?: string;
  ingredients: ThemeIngredient[];
  adventure: {
    title: string;
    description: string;
  };
  natureCraft: {
    title: string;
    description: string;
  };
  books: ThemeBook[];
  badgeName: string;
}

export const themes: Theme[] = [
  {
    slug: "memory-soup",
    title: "記憶中的香香湯",
    tagline: "有沒有什麼味道，是你一聞就覺得好安心好開心的？",
    soupSlug: "memory-scent",
    audioSrc: "/audios/herbal-patch-story.mp3",
    magicSubtitleZh: "✨ 聽一聽《記憶中的香香湯》的魔法故事",
    magicParagraphsZh: [
      "早晨裡，小狐狸發現今天的空氣中，湯的香氣和花香味變得好淡。她甚至擔心：會不會是自己的鼻子壞掉了？",
      "貓頭鷹和小鳥陪她到花園裡找啊找，繞了好幾圈，終於在一個小角落，捉到一絲絲熟悉的香味線索。",
      "她決定煮一鍋「記憶中的香香湯」：放進最愛的一朵花、幾片香香的葉子，還有一顆小小的「記憶核果」。湯在鍋裡咕嚕咕嚕滾起來時，香氣回來了。她把湯分給兔子、小鳥和貓頭鷹，和大家一起，把味道留在今天。",
    ],
    magicParagraphsEn: [
      "One morning, the little fox noticed the soup scent and flower scent in the air had gone very quiet. She even worried—had her nose stopped working?",
      "An owl and a little bird went with her into the garden to search, round and round—until, in one small corner, they caught a thread of a familiar fragrance.",
      'She decided to cook “Scented Soup in Memory”: her favorite blossom, a few fragrant leaves, and one tiny “memory nut.” As the soup bubbled in the pot, the scent came back. She shared the bowl with a rabbit, the bird, and the owl—keeping the taste in today, together.',
    ],
    magicImageSrc: "/images/stories/herbal-patch-story.png",
    magicImageAlt:
      "橘色小狐狸穿著圍裙，在溫暖的廚房裡攪拌發著金光的湯，湯裡飄著小花與香草。",
    ingredients: [
      {
        slug: "soft-flower",
        name: "軟綿綿小花",
        description: "像奶奶洗完棉被曬太陽後的味道，軟綿綿又暖呼呼。",
        locationSlug: "herbal-patch",
        locationName: "草藥花園",
        collection: {
          type: "choice",
          prompt: "菲娜說：這朵花聞起來像什麼？",
          options: [
            {
              text: "像曬過太陽的棉被，軟軟暖暖的",
              finaResponse: "對！就是這個！像奶奶家的棉被，讓人好安心。",
            },
            {
              text: "像雨後的泥土，濕濕涼涼的",
              finaResponse: "這朵也很特別，雨後的味道讓人想起很多事。",
            },
            {
              text: "像糖果，甜甜黏黏的",
              finaResponse: "哈哈，甜甜的也不錯！加進湯裡一定很有趣。",
            },
          ],
        },
      },
      {
        slug: "bread-chunk",
        name: "烤麵包香塊",
        description: "剛出爐的吐司香，會讓人想起起床時的好心情。",
        locationSlug: "ingredient-woods",
        locationName: "湯料森林",
        collection: {
          type: "riddle",
          prompt: "湯料森林裡藏著一個謎語",
          riddle: {
            question: "我住在早晨，我住在廚房，我讓人想起剛起床的味道，我是什麼？",
            answer: "麵包",
            hint: "菲娜說：想想看早餐桌上常常有什麼⋯⋯",
            finaResponse: "答對了！剛出爐的香味，是最溫暖的早晨記憶。",
          },
        },
      },
      {
        slug: "cloud-icecream",
        name: "雲朵香草冰淇淋",
        description: "甜甜的香草冰，一咬會笑出來，是夏天的記憶味道。",
        locationSlug: "brewing-shed",
        locationName: "熟成室",
        collection: {
          type: "secret",
          prompt: "熟成室的魔法需要你的記憶來召喚",
          secret: {
            placeholder: "你最喜歡的味道是⋯⋯",
            finaResponse: "謝謝你告訴我。這個味道現在也放進湯裡了。",
          },
        },
      },
    ],
    adventure: {
      title: "找一個記憶裡的味道",
      description:
        "找一個讓你想起某個人的味道——可以是食物、花、或任何東西。告訴大人那個味道讓你想起誰，以及一個關於那個人的小故事。",
    },
    natureCraft: {
      title: "香味收藏夾",
      description:
        "去外面採一片葉子或花瓣，放在書頁裡壓平。在旁邊寫下（或請大人幫你寫）：這個味道讓你想起什麼？這是你今天的香味收藏。",
    },
    books: [
      {
        title: "獾的禮物",
        author: "Susan Varley",
        reason: "關於記憶與思念，溫柔地說明一個人離開後留下的東西。",
      },
      {
        title: "爺爺的牆",
        author: "Eve Bunting",
        reason: "透過氣味和記憶連結兩代之間的情感。",
      },
      {
        title: "外婆的魔法廚房",
        author: "Ursula Wolfel",
        reason: "食物與記憶的連結，很適合飯後一起讀。",
      },
    ],
    badgeName: "香味守護者",
  },
];

export function getThemeBySlug(slug: string): Theme | undefined {
  return themes.find((t) => t.slug === slug);
}
