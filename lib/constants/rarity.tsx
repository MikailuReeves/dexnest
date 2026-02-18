export const RARITIES = [
  "Common",
  "Uncommon",
  "Rare",
  "Double Rare",
  "Ultra Rare",
  "Illustration Rare",
  "Special Illustration Rare",
  "Hyper Rare",
  "Shiny Rare",
  "Shiny Ultra Rare",
  "Secret Rare",
] as const;

export type Rarity = (typeof RARITIES)[number];
