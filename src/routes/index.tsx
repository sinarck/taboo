"use client"

import { createFileRoute } from "@tanstack/react-router"
import { useCallback } from "react"
import { GameArea } from "@/components/game-area"
import { GameHeader } from "@/components/game-header"
import { HelpDialog } from "@/components/help-dialog"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { ResetConfirmDialog } from "@/components/reset-confirm-dialog"
import { ScoreDisplay } from "@/components/score-display"
import { SettingsDialog } from "@/components/settings-dialog"
import { useDialogs } from "@/hooks/use-dialogs"
import { useGameKeyboard } from "@/hooks/use-game-keyboard"
import { useGameTimer } from "@/hooks/use-game-timer"
import { useStoreHydrated } from "@/hooks/use-store-hydrated"
import { useGameStore } from "@/stores/game"
import { getCardById } from "@/data/taboo-cards"
import { cn } from "@/utils/cn"

export const Route = createFileRoute("/")({
  component: TabooGame,
})

function TabooGame() {
  const dialogs = useDialogs()
  const hydrated = useStoreHydrated()

  const {
    teams,
    currentTeamIndex,
    gameStarted,
    currentCardId,
    isPaused,
    roundNumber,
    settings,
    endAt,
    pausedMs,
    togglePause,
    startRound,
    handleCorrect,
    handleSkip,
    endRound,
    resetGame,
  } = useGameStore()

  const timeRemaining = useGameTimer({
    endAt,
    pausedMs,
    fallbackSeconds: settings.timerDuration,
    onExpire: endRound,
  })

  const openSettings = useCallback(() => dialogs.open("settings"), [dialogs])
  const openHelp = useCallback(() => dialogs.open("help"), [dialogs])
  const openReset = useCallback(() => dialogs.open("reset"), [dialogs])

  useGameKeyboard({
    onCorrect: handleCorrect,
    onSkip: handleSkip,
    onPause: togglePause,
    onOpenHelp: openHelp,
    gameStarted,
    isPaused,
  })

  const currentTeam = teams[currentTeamIndex]
  const currentCard = currentCardId === null ? null : getCardById(currentCardId) ?? null
  const hasPlayed = roundNumber > 0

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col px-6 pt-12 pb-8 lg:max-w-3xl lg:py-8">
      <GameHeader
        gameStarted={gameStarted && hydrated}
        hasPlayed={hasPlayed && hydrated}
        activeTeamName={currentTeam?.name}
        timeRemaining={timeRemaining}
        onOpenSettings={openSettings}
        onOpenHelp={openHelp}
      />

      <div
        className={cn(
          "flex flex-1 flex-col justify-center gap-12 transition-opacity duration-150",
          !hydrated && "invisible",
        )}
      >
        <ScoreDisplay teams={teams} currentTeamIndex={currentTeamIndex} />

        <GameArea
          gameStarted={gameStarted}
          isPaused={isPaused}
          currentCard={currentCard}
          hasPlayed={hasPlayed}
          onCorrect={handleCorrect}
          onSkip={handleSkip}
          onStartRound={startRound}
        />
      </div>

      <footer className="mt-12">
        <KeyboardShortcuts />
      </footer>

      {hydrated ? (
        <>
          <SettingsDialog
            open={dialogs.isOpen("settings")}
            onOpenChange={dialogs.toggle("settings")}
            onResetRequest={openReset}
          />
          <HelpDialog
            open={dialogs.isOpen("help")}
            onOpenChange={dialogs.toggle("help")}
          />
          <ResetConfirmDialog
            open={dialogs.isOpen("reset")}
            onOpenChange={dialogs.toggle("reset")}
            onConfirm={resetGame}
          />
        </>
      ) : null}
    </main>
  )
}
