/**
 * Forest Soup House — Stories（資料層）
 * 獨立故事集已停用；故事入口改由主題包 `/themes/[slug]` 與 `/stories` 列表（主題包網格）。
 * 保留型別供未來擴充或型別匯入。
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
  titleZh?: string;
  characterSlugs?: string[];
  sections: StorySection[];
  image?: string;
  relatedSoupCardSlug?: string;
  relatedAdventureSlug?: string;
  themeSlug?: string;
  audioSrc?: string;
  magicSubtitleZh?: string;
  imageAlt?: string;
  paragraphsZh?: string[];
  paragraphsEn?: string[];
}

export const stories: Story[] = [];
