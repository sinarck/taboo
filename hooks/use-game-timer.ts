"use client"

import { useEffect } from "react"

interface UseGameTimerProps {
  timeRemaining: number
  timerActive: boolean
  isPaused: boolean
  onTick: (newTime: number) => void
  onTimerEnd: () => void
}

export function useGameTimer({
  timeRemaining,
  timerActive,
  isPaused,
  onTick,
  onTimerEnd,
}: UseGameTimerProps) {
  useEffect(() => {
    if (!timerActive || timeRemaining <= 0 || isPaused) return

    const interval = setInterval(() => {
      if (timeRemaining <= 1) {
        onTimerEnd()
      } else {
        onTick(timeRemaining - 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [timerActive, timeRemaining, isPaused, onTick, onTimerEnd])
}
