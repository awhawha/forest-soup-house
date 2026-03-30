/**
 * Forest Soup House — Today's Adventure
 * One story-world prompt per day. Used on homepage.
 */

export interface Adventure {
  id: string;
  title: string;
  prompt: string;
  narrative?: string;
  characterName?: string;
  location?: string;
}

export const adventures: Adventure[] = [
  {
    id: "adv-1",
    title: "Find a forest smell",
    prompt:
      "With your grown-up, find something outside that smells like the forest. It might be a leaf, a flower, or the air after rain. Tell each other what it reminds you of.",
    narrative: "The forest is full of small smells today. Something is waiting for you to notice.",
    characterName: "Fina",
    location: "the Soup House path",
  },
  {
    id: "adv-2",
    title: "Share a soup story",
    prompt:
      "Think of a time when you had soup (or something warm in a bowl). Tell your grown-up about it. What did it smell like? Who were you with?",
    narrative: "Fina is waiting by the Soup House. She has something warm to share.",
    characterName: "Fina",
    location: "the Soup House",
  },
  {
    id: "adv-3",
    title: "One ingredient of the day",
    prompt:
      "Pick one thing you see today that could go in a magic soup. It could be a color, a sound, or a feeling. Tell your grown-up why you chose it.",
    narrative: "Poffy is stirring something that smells like morning. What would you add?",
    characterName: "Poffy",
    location: "the Whisper Shed",
  },
];
