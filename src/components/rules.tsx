"use client"

import { cn } from "@/utils/cn"

interface RulesProps {
  className?: string
}

export function Rules({ className }: RulesProps) {
  return (
    <ol className={cn("space-y-3 text-sm text-muted-foreground", className)}>
      <li>
        <span className="text-foreground font-medium">One player is the clue-giver.</span>{" "}
        They describe the word on the card so their teammates can guess it.
      </li>
      <li>
        <span className="text-foreground font-medium">Don&apos;t say the taboo words.</span>{" "}
        The card lists five forbidden words; using any of them — or sounds, gestures,
        or rhymes — is not allowed.
      </li>
      <li>
        <span className="text-foreground font-medium">Guess freely.</span> Teammates
        can blurt out as many guesses as they want. Once the exact word lands,
        move on to the next card.
      </li>
      <li>
        <span className="text-foreground font-medium">Score and skip.</span> Each
        correct guess scores a point. Skipping a hard card costs a point (after
        any free skips you&apos;ve allowed in settings).
      </li>
      <li>
        <span className="text-foreground font-medium">Beat the clock.</span> When
        the timer hits zero the round ends, and the device passes to the next team.
      </li>
    </ol>
  )
}
