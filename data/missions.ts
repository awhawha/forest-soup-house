/**
 * Forest Soup House — Missions
 * Little adventures to try with a grown-up. All displayed on one page in v1.
 */

export interface Mission {
  id: string;
  title: string;
  prompt: string;
  source?: string;
}

export const missions: Mission[] = [
  {
    id: "mission-1",
    title: "Find a forest smell",
    prompt:
      "With your grown-up, find something outside that smells like the forest. It might be a leaf, a flower, or the air after rain. Tell each other what it reminds you of.",
    source: "From the Whisper Shed",
  },
  {
    id: "mission-2",
    title: "Share a soup story",
    prompt:
      "Think of a time when you had soup (or something warm in a bowl). Tell your grown-up about it. What did it smell like? Who were you with?",
    source: "From the Whisper Shed",
  },
  {
    id: "mission-3",
    title: "One ingredient of the day",
    prompt:
      "Pick one thing you see today that could go in a magic soup. It could be a color, a sound, or a feeling. Tell your grown-up why you chose it.",
    source: "From the Whisper Shed",
  },
];
