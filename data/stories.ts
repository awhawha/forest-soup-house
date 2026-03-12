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
  characterSlugs?: string[];
  sections: StorySection[];
  image?: string;
  /** Slug of a soup card to show after the story (e.g. curiosity-soup). */
  relatedSoupCardSlug?: string;
  /** Id of a mission to show after the story (e.g. mission-2). */
  relatedMissionId?: string;
}

export const stories: Story[] = [
  {
    slug: "finas-first-soup",
    title: "Fina's First Soup",
    description: "Fina learns what happens when you add a little bit of curiosity to the pot.",
    characterSlugs: ["fina", "poffy"],
    image: "/images/stories/finas-first-soup.png",
    relatedSoupCardSlug: "curiosity-soup",
    relatedMissionId: "mission-2",
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
