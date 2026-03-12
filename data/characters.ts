/**
 * Forest Soup House — Characters
 * Types and data for forest friends. Fina has a full profile; others can be card-only for v1.
 */

export interface Character {
  slug: string;
  name: string;
  tagline: string;
  bio?: string;
  quote?: string;
  quoteAttribution?: string;
  image?: string;
  links?: { label: string; href: string }[];
}

export const characters: Character[] = [
  {
    slug: "fina",
    name: "Fina",
    tagline: "Curious fox who loves soup and asks the best questions.",
    bio: "Fina is a curious fox who lives in the forest. She loves to smell the herbs in the Soup House and ask Poffy what's in the pot. When she's not exploring, she likes to sit by the fire and listen to stories.",
    quote: "Soup is best when you share it.",
    quoteAttribution: "— Fina",
    image: "/images/characters/fina.png",
    links: [
      { label: "Read a story with Fina", href: "/stories" },
      { label: "Visit the Soup House", href: "/world" },
    ],
  },
  {
    slug: "poffy",
    name: "Poffy",
    tagline: "Magical helper who stirs the pot and keeps everyone warm.",
    image: "/images/characters/poffy.png",
  },
  {
    slug: "lilo",
    name: "Lilo",
    tagline: "Guardian of ingredients. Loves to experiment in the Soup Magic Lab.",
    image: "/images/characters/lilo.png",
  },
];
