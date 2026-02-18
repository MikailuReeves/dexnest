export const TYPES = [
  "Bug",
  "Dragon",
  "Dark",
  "Electric",
  "Fairy",
  "Fighting",
  "Fire",
  "Flying",
  "Ghost",
  "Grass",
  "Ground",
  "Ice",
  "Normal",
  "Poison",
  "Psychic",
  "Rock",
  "Steel",
  "Water",
] as const;

export type Types = (typeof TYPES)[number];
