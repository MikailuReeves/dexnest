export const TYPES = [
  "Bug",
  "Dragon",
  "Darkness",
  "Lightning",
  "Fairy",
  "Fighting",
  "Fire",
  "Flying",
  "Ghost",
  "Grass",
  "Ground",
  "Ice",
  "Colorless",
  "Poison",
  "Psychic",
  "Rock",
  "Metal",
  "Water",
] as const;

export type Types = (typeof TYPES)[number];
