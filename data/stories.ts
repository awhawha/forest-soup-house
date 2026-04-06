/**
 * Forest Soup House — Stories
 * Story episodes. Each has a slug, title, description, and sections for the story body.
 */

export interface StorySection {
  title?: string;
  content: string;
}

export interface Story {
  slug: string;
  title: string;
  description: string;
  descriptionZh?: string;
  /** 繁中標題（列表與魔法故事屋用） */
  titleZh?: string;
  characterSlugs?: string[];
  sections: StorySection[];
  image?: string;
  /** Slug of a soup card to show after the story (e.g. curiosity-soup). */
  relatedSoupCardSlug?: string;
  /** Slug of an adventure to show after the story (e.g. share-a-soup-story). */
  relatedAdventureSlug?: string;

  /**
   * 若有對應主題包：列表卡片連到 `/themes/[themeSlug]`，`/stories/[slug]` 也會導向同一頁。
   * 例：`herbal-patch-story` → `memory-soup`
   */
  themeSlug?: string;

  /** 魔法故事屋：雙語朗讀 + 音檔（有則走 MagicStoryHouse 版型） */
  audioSrc?: string;
  /** 魔法故事屋副標，例如：✨ 聽一聽《記憶中的香香湯》的魔法故事 */
  magicSubtitleZh?: string;
  /** 插圖替代文字 */
  imageAlt?: string;
  paragraphsZh?: string[];
  paragraphsEn?: string[];
}

export function isMagicStory(story: Story): boolean {
  return Boolean(
    story.audioSrc &&
      story.paragraphsZh?.length &&
      story.paragraphsEn?.length &&
      story.paragraphsZh.length === story.paragraphsEn.length,
  );
}

export const stories: Story[] = [
  {
    slug: "herbal-patch-story",
    title: "Scented Soup in Memory",
    titleZh: "記憶中的香香湯",
    description:
      "When the scents go quiet, a little fox stirs them back—with help from friends and one warm pot.",
    descriptionZh:
      "當香味變得很小聲，小狐狸想把香氣找回來——有朋友的幫忙，還有一鍋暖暖的湯。",
    characterSlugs: ["fina"],
    image: "/images/stories/herbal-patch-story.png",
    /** 完整互動與全文在「主題包」頁 */
    themeSlug: "memory-soup",
    sections: [],
    relatedSoupCardSlug: "memory-scent",
  },
  {
    slug: "finas-first-soup",
    title: "Fina's First Soup",
    description: "Fina learns what happens when you add a little bit of curiosity to the pot.",
    characterSlugs: ["fina", "poffy"],
    image: "/images/stories/finas-first-soup.png",
    relatedSoupCardSlug: "curiosity-soup",
    relatedAdventureSlug: "share-a-soup-story",
    sections: [
      {
        content:
          "It was a quiet morning in the forest. Fina had woken up early and tiptoed to the Soup House. She could already smell something warm in the air.",
      },
      {
        title: "The pot",
        content:
          "Poffy was stirring a big pot. \"Good morning, Fina,\" said Poffy. \"Would you like to help?\" Fina nodded. She stood on her tiptoes and looked into the pot. \"What's in there?\" she asked. \"A little bit of this,\" said Poffy, \"and a little bit of that. And one secret ingredient.\" \"What's the secret?\" asked Fina. Poffy smiled. \"You.\"",
      },
      {
        content:
          "Fina felt something warm in her chest. She helped stir the soup. When it was ready, they sat down together and shared it. And Fina decided that soup was her favorite thing in the whole forest.",
      },
    ],
  },
];
