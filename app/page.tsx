"use client"

import { useState, useEffect, useCallback } from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GameCard } from "@/components/game-card"
import { ScoreDisplay } from "@/components/score-display"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { SettingsDialog } from "@/components/settings-dialog"
import { useGameStore } from "@/lib/game-store"
import { useGameKeyboard } from "@/hooks/use-game-keyboard"
import { useGameTimer } from "@/hooks/use-game-timer"

export default function TabooGame() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const {
    teams,
    currentTeamIndex,
    gameStarted,
    currentCard,
    timeRemaining,
    timerActive,
    isPaused,
    roundNumber,
    settings,
    togglePause,
    setTimeRemaining,
    setTimerActive,
    resetGame,
    startRound,
    handleCorrect,
    handleSkip,
    endRound,
    setSettings,
    addTeam,
    removeTeam,
    setTeamName,
    setTeamScore,
  } = useGameStore()

  // Hydration
  useEffect(() => {
    setHydrated(true)
  }, [])

  // Timer end handler
  const handleTimerEnd = useCallback(() => {
    setTimerActive(false)
    endRound()
  }, [setTimerActive, endRound])

  // Custom hooks
  useGameTimer({
    timeRemaining,
    timerActive,
    isPaused,
    onTick: setTimeRemaining,
    onTimerEnd: handleTimerEnd,
  })

  useGameKeyboard({
    onCorrect: handleCorrect,
    onSkip: handleSkip,
    onPause: togglePause,
    onOpenSettings: () => setSettingsOpen(true),
    gameStarted,
    isPaused,
  })

  // Derived state
  const isInitialState = roundNumber === 0
  const currentTeam = teams[currentTeamIndex]

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        <div className="max-w-2xl mx-auto">
          <Header />
          <div className="flex items-center justify-center py-32">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8 md:px-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-6 sm:gap-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Taboo</h1>
          <div className="flex items-center gap-3">
            {gameStarted && (
              <div className="flex items-center justify-center rounded-full bg-muted px-4 py-1.5">
                <span className="text-base sm:text-lg font-semibold tabular-nums tracking-tight">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="h-9 w-9 rounded-full"
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </header>

        {/* Scores */}
        <ScoreDisplay teams={teams} currentTeamIndex={currentTeamIndex} />

        {/* Game Area */}
        <GameArea
          gameStarted={gameStarted}
          isPaused={isPaused}
          currentCard={currentCard}
          isInitialState={isInitialState}
          currentTeamName={currentTeam?.name}
          onCorrect={handleCorrect}
          onSkip={handleSkip}
          onStartRound={startRound}
        />

        {/* Keyboard Shortcuts */}
        <KeyboardShortcuts />
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSettingsChange={setSettings}
        teams={teams}
        onAddTeam={addTeam}
        onRemoveTeam={removeTeam}
        onTeamNameChange={setTeamName}
        onTeamScoreChange={setTeamScore}
        onNewGame={resetGame}
      />
    </main>
  )
}

// Sub-components
function Header() {
  return (
    <div className="flex items-center justify-between gap-2">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Taboo</h1>
      <Button variant="outline" size="icon" className="h-10 w-10 sm:h-9 sm:w-9">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  )
}

interface GameAreaProps {
  gameStarted: boolean
  isPaused: boolean
  currentCard: ReturnType<typeof useGameStore>["currentCard"]
  isInitialState: boolean
  currentTeamName?: string
  onCorrect: () => void
  onSkip: () => void
  onStartRound: () => void
}

function GameArea({
  gameStarted,
  isPaused,
  currentCard,
  isInitialState,
  currentTeamName,
  onCorrect,
  onSkip,
  onStartRound,
}: GameAreaProps) {
  // Paused state
  if (gameStarted && isPaused) {
    return (
      <div className="flex flex-col items-center justify-center py-20 sm:py-24">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Paused</h2>
          <p className="text-sm text-muted-foreground">Press P to resume</p>
        </div>
      </div>
    )
  }

  // Active game state
  if (gameStarted && currentCard) {
    return (
      <div className="flex flex-col gap-4 sm:gap-6">
        <GameCard card={currentCard} />
        <div className="flex gap-3 justify-center">
          <Button
            size="lg"
            onClick={onCorrect}
            className="flex-1 max-w-40 h-12 font-semibold text-base rounded-full"
          >
            Correct
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onSkip}
            className="flex-1 max-w-40 h-12 font-semibold text-base rounded-full"
          >
            Skip
          </Button>
        </div>
      </div>
    )
  }

  // Start / Between rounds state
  return (
    <div className="flex flex-col items-center justify-center py-20 sm:py-24">
      {isInitialState ? (
        <div className="space-y-6 text-center">
          <p className="text-lg text-muted-foreground">Ready to play?</p>
          <Button size="lg" onClick={onStartRound} className="h-12 px-8 font-semibold rounded-full">
            Start Game
          </Button>
        </div>
      ) : (
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground uppercase tracking-widest">Next Up</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{currentTeamName}</h2>
          </div>
          <Button size="lg" onClick={onStartRound} className="h-12 px-8 font-semibold rounded-full">
            Start Round
          </Button>
        </div>
      )}
    </div>
  )
}
