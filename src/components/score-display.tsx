"use client"

import { cn } from "@/utils/cn"
import type { Team } from "@/types/game"

type ScoreDisplayProps = {
  teams: Team[]
  currentTeamIndex: number
}

export function ScoreDisplay({ teams, currentTeamIndex }: ScoreDisplayProps) {
  return (
    <section aria-label="Scoreboard">
      <ul className="flex flex-wrap items-end justify-center gap-x-10 gap-y-6 sm:gap-x-14">
        {teams.map((team, index) => {
          const isActive = index === currentTeamIndex
          return (
            <li key={team.id} className="text-center">
              <p
                className={cn(
                  "section-label",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {team.name}
              </p>
              <p
                className={cn(
                  "mt-1 text-5xl font-bold tabular tracking-tight sm:text-6xl",
                  isActive ? "text-foreground" : "text-muted-foreground/40",
                )}
              >
                {team.score}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
