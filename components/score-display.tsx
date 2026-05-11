"use client"

import type { Team } from "@/lib/types"

interface ScoreDisplayProps {
  teams: Team[]
  currentTeamIndex: number
}

export function ScoreDisplay({ teams, currentTeamIndex }: ScoreDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-14 flex-wrap py-2">
      {teams.map((team, index) => (
        <div 
          key={index} 
          className={`text-center transition-all duration-200 ${
            currentTeamIndex === index 
              ? "opacity-100 scale-100" 
              : "opacity-35 scale-95"
          }`}
        >
          <div className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2 truncate max-w-24 sm:max-w-32">
            {team.name}
          </div>
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold tabular-nums tracking-tight">
            {team.score}
          </div>
        </div>
      ))}
    </div>
  )
}
