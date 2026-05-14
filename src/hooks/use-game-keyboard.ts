"use client"

import { useHotkeys } from "@tanstack/react-hotkeys"

interface UseGameKeyboardProps {
  onCorrect: () => void
  onSkip: () => void
  onPause: () => void
  onOpenHelp: () => void
  gameStarted: boolean
  isPaused: boolean
}

export function useGameKeyboard({
  onCorrect,
  onSkip,
  onPause,
  onOpenHelp,
  gameStarted,
  isPaused,
}: UseGameKeyboardProps) {
  useHotkeys(
    [
      {
        hotkey: "Space",
        callback: onCorrect,
        options: {
          enabled: gameStarted && !isPaused,
          meta: { name: "Correct", description: "Mark the current card as correct" },
        },
      },
      {
        hotkey: "S",
        callback: onSkip,
        options: {
          enabled: gameStarted && !isPaused,
          meta: { name: "Skip", description: "Skip the current card" },
        },
      },
      {
        hotkey: "P",
        callback: onPause,
        options: {
          enabled: gameStarted,
          meta: { name: "Pause", description: "Pause or resume the round" },
        },
      },
      {
        hotkey: { key: "/", shift: true },
        callback: onOpenHelp,
        options: {
          meta: { name: "Help", description: "Open the help dialog" },
        },
      },
    ],
    { requireReset: true },
  )
}
