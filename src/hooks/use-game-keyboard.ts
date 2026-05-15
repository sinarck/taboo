"use client";

import { useHotkeys } from "@tanstack/react-hotkeys";

interface UseGameKeyboardProps {
  onCorrect: () => void;
  onSkip: () => void;
  onPause: () => void;
  onOpenHelp: () => void;
  onStartRound: () => void;
  onPreviewPrevious: () => void;
  gameStarted: boolean;
  isPaused: boolean;
}

export function useGameKeyboard({
  onCorrect,
  onSkip,
  onPause,
  onOpenHelp,
  onStartRound,
  onPreviewPrevious,
  gameStarted,
  isPaused,
}: UseGameKeyboardProps) {
  useHotkeys(
    [
      // Space doubles as the primary action: mark correct during a round,
      // start the round otherwise. Disabled when paused so the player can't
      // score a card they can't see.
      {
        hotkey: "Space",
        callback: () => (gameStarted ? onCorrect() : onStartRound()),
        options: {
          enabled: !isPaused,
          meta: {
            name: "Correct",
            description: "Mark the current card as correct or start a round",
          },
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
        hotkey: "Backspace",
        callback: onPreviewPrevious,
        options: {
          enabled: gameStarted && isPaused,
          meta: { name: "Previous", description: "Preview the previous card" },
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
  );
}
