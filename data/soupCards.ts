/**
 * Forest Soup House — Soup Cards
 * Soups of the forest. Each has a name, mood, description, optional character and ingredients.
 */

export interface SoupCard {
  slug: string;
  name: string;
  mood: string;
  description: string;
  characterSlug?: string;
  ingredients?: string[];
  image?: string;
}

export const soupCards: SoupCard[] = [
  {
    slug: "memory-soup",
    name: "Memory Soup",
    mood: "Remembering",
    description:
      "A gentle soup for when you want to remember someone warm. Fina makes it when she misses a friend.",
    characterSlug: "fina",
    ingredients: [
      "a pinch of thyme",
      "one quiet moment",
      "something that reminds you of them",
    ],
    image: "/images/soups/memory-soup.png",
  },
  {
    slug: "morning-light-soup",
    name: "Morning Light Soup",
    mood: "Starting the day",
    description:
      "What Poffy stirs when the forest is still sleepy. It tastes like the first light through the trees.",
    characterSlug: "poffy",
    ingredients: ["sunlight", "quiet", "a little honey"],
    image: "/images/soups/morning-light.png",
  },
  {
    slug: "curiosity-soup",
    name: "Curiosity Soup",
    mood: "Wondering",
    description:
      "For when you have too many questions. Lilo says the best ingredient is asking \"What if?\"",
    characterSlug: "lilo",
    ingredients: ["one question", "a handful of wonder", "patience"],
    image: "/images/soups/curiosity.png",
  },
];
