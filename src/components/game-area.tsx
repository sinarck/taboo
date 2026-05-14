"use client"

import { GameCard } from "@/components/game-card"
import { Rules } from "@/components/rules"
import { Button } from "@/components/ui/button"
import type { TabooCard } from "@/data/taboo-cards"

type GameAreaProps = {
  gameStarted: boolean
  isPaused: boolean
  currentCard: TabooCard | null
  hasPlayed: boolean
  onCorrect: () => void
  onSkip: () => void
  onStartRound: () => void
}

export function GameArea({
  gameStarted,
  isPaused,
  currentCard,
  hasPlayed,
  onCorrect,
  onSkip,
  onStartRound,
}: GameAreaProps) {
  if (gameStarted && isPaused) {
    return (
      <section id="main-content" className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Round paused</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Press <kbd className="kbd">P</kbd> to resume
        </p>
      </section>
    )
  }

  if (gameStarted && currentCard) {
    return (
      <section id="main-content">
        <GameCard card={currentCard} />
        <div className="mt-10 grid grid-cols-2 gap-2">
          <Button variant="outline" size="lg" onClick={onSkip}>
            Skip
          </Button>
          <Button size="lg" onClick={onCorrect}>
            Correct
          </Button>
        </div>
      </section>
    )
  }

  if (!hasPlayed) {
    return (
      <section id="main-content" className="space-y-8">
        <div>
          <h2 className="section-label mb-3">How to play</h2>
          <Rules />
        </div>
        <div className="flex justify-center">
          <Button size="lg" onClick={onStartRound}>
            Start round
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section id="main-content" className="flex justify-center">
      <Button size="lg" onClick={onStartRound}>
        Start round
      </Button>
    </section>
  )
}
