"use client"

import { useEffect } from "react"

interface UseGameKeyboardProps {
  onCorrect: () => void
  onSkip: () => void
  onPause: () => void
  onOpenSettings: () => void
  gameStarted: boolean
  isPaused: boolean
}

export function useGameKeyboard({
  onCorrect,
  onSkip,
  onPause,
  onOpenSettings,
  gameStarted,
  isPaused,
}: UseGameKeyboardProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }

      if (e.key === "p" || e.key === "P") {
        e.preventDefault()
        if (gameStarted) {
          onPause()
        }
        return
      }

      if (isPaused) return

      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault()
        onCorrect()
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault()
        onSkip()
      } else if (e.key === "?") {
        e.preventDefault()
        onOpenSettings()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [onCorrect, onSkip, onPause, onOpenSettings, gameStarted, isPaused])
}
