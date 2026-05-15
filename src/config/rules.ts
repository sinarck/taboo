export type Rule = {
  readonly title: string;
  readonly body: string;
};

export const gameRules: readonly Rule[] = [
  {
    title: "Describe the word",
    body: "One player is the clue-giver. They see the card and help their team guess the big word on top.",
  },
  {
    title: "Avoid the taboo words",
    body: "Five forbidden words sit under each card. Sound-alikes, rhymes, charades, abbreviations, and spelling all count as a slip.",
  },
  {
    title: "Score and skip",
    body: "Each correct guess scores a point. Skip a card any time, but anything past your free skips deducts the skip penalty.",
  },
  {
    title: "Beat the clock",
    body: "When the timer hits zero the round ends mid-card. The current card doesn't count and the device passes to the next team.",
  },
  {
    title: "Honor system",
    body: "There's no referee. If the other team hears a taboo word, buzz them and deduct a point. Disputes resolved by group consensus.",
  },
] as const;
