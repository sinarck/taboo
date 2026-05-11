"use client"

import type { TabooCard } from "@/lib/taboo-words"

interface GameCardProps {
  card: TabooCard
}

export function GameCard({ card }: GameCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 sm:p-8 md:p-10 shadow-sm">
      <div className="space-y-6 sm:space-y-8">
        {/* Main Word */}
        <div className="text-center py-2 sm:py-4">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground tracking-tight break-words text-balance">
            {card.word}
          </h2>
        </div>

        {/* Taboo Words */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Don&apos;t Say
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <ul className="grid gap-1.5 sm:gap-2 text-center">
            {card.tabooWords.map((word, index) => (
              <li 
                key={index} 
                className="text-base sm:text-lg md:text-xl text-muted-foreground/70 font-medium"
              >
                {word}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
