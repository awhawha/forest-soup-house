/**
 * Forest Soup House — Locations
 * Places in the forest. Used on the World page. No individual location pages in v1.
 */

export interface Location {
  slug: string;
  name: string;
  description: string;
  image?: string;
}

export const locations: Location[] = [
  {
    slug: "soup-house",
    name: "Forest Soup House",
    description: "Where Fina and friends make soup and tell stories.",
    image: "/images/places/soup-house.png",
  },
  {
    slug: "whisper-shed",
    name: "Whisper Shed",
    description: "The forest post office where little adventures and secrets are kept.",
    image: "/images/places/whisper-shed.png",
  },
  {
    slug: "soup-magic-lab",
    name: "Soup Magic Lab",
    description: "Where Lilo experiments with ingredients and gentle magic.",
    image: "/images/places/soup-magic-lab.png",
  },
];
