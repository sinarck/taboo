"use client";

import type { TabooCard } from "@/data/taboo-cards";

interface GameCardProps {
  card: TabooCard;
}

export function GameCard({ card }: GameCardProps) {
  return (
    <article className="text-center">
      <h2 className="text-4xl font-semibold tracking-tight text-balance wrap-break-word sm:text-5xl">
        {card.word}
      </h2>

      <div className="mt-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="section-label">Don&apos;t say</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <ul className="mt-6 grid gap-2 text-lg text-muted-foreground sm:text-xl">
        {card.tabooWords.map((word) => (
          <li key={word} className="font-medium">
            {word}
          </li>
        ))}
      </ul>
    </article>
  );
}
