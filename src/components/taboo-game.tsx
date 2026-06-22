"use client";

import "@tanstack/react-start/client-only";
import { useCallback, useMemo } from "react";
import { useTimer } from "react-timer-hook";
import { GameArea } from "@/components/game-area";
import { GameHeader } from "@/components/game-header";
import { HelpDialog } from "@/components/dialogs/help-dialog";
import { ResetConfirmDialog } from "@/components/dialogs/reset-confirm-dialog";
import { SettingsDialog } from "@/components/dialogs/settings-dialog";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { ScoreDisplay } from "@/components/score-display";
import { useDialogs } from "@/hooks/use-dialogs";
import { useGameKeyboard } from "@/hooks/use-game-keyboard";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { useGameStore } from "@/stores/game";
import { getCardById } from "@/data/taboo-cards";
import { cn } from "@/utils/cn";

export function TabooGame() {
  const dialogs = useDialogs();
  const hydrated = useStoreHydrated();

  const {
    teams,
    currentTeamIndex,
    gameStarted,
    currentCardId,
    usedCardIds,
    previewingPrevious,
    roundNumber,
    settings,
    togglePreviewPrevious,
    startRound,
    handleCorrect,
    handleSkip,
    endRound,
    resetGame,
  } = useGameStore();

  // Placeholder expiry — useTimer needs an initial value, but autoStart is
  // false and handleStartRound calls restart() with a fresh expiry on every
  // round, so this is never actually counted down from.
  const initialExpiry = useMemo(
    () => new Date(Date.now() + settings.timerDuration * 1000),
    [settings.timerDuration],
  );
  const { totalSeconds, isRunning, pause, resume, restart } = useTimer({
    expiryTimestamp: initialExpiry,
    autoStart: false,
    onExpire: endRound,
  });

  const isPaused = gameStarted && !isRunning;

  const handleStartRound = useCallback(() => {
    startRound();
    restart(new Date(Date.now() + settings.timerDuration * 1000), true);
  }, [restart, settings.timerDuration, startRound]);

  const handleTogglePause = useCallback(() => {
    if (!gameStarted) return;
    if (isRunning) pause();
    else resume();
  }, [gameStarted, isRunning, pause, resume]);

  const openSettings = useCallback(() => dialogs.open("settings"), [dialogs]);
  const openHelp = useCallback(() => dialogs.open("help"), [dialogs]);
  const openReset = useCallback(() => dialogs.open("reset"), [dialogs]);

  useGameKeyboard({
    onCorrect: handleCorrect,
    onSkip: handleSkip,
    onPause: handleTogglePause,
    onOpenHelp: openHelp,
    onStartRound: handleStartRound,
    onPreviewPrevious: togglePreviewPrevious,
    gameStarted,
    isPaused,
  });

  const currentTeam = teams[currentTeamIndex];
  const currentCard = currentCardId === null ? null : (getCardById(currentCardId) ?? null);
  const previousCardId =
    previewingPrevious && usedCardIds.length >= 2 ? usedCardIds[usedCardIds.length - 2] : null;
  const previousCard =
    previousCardId === null || previousCardId === undefined
      ? null
      : (getCardById(previousCardId) ?? null);
  const hasPlayed = roundNumber > 0;

  const timeRemaining = gameStarted ? totalSeconds : settings.timerDuration;

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
          previousCard={previousCard}
          hasPlayed={hasPlayed}
          onCorrect={handleCorrect}
          onSkip={handleSkip}
          onStartRound={handleStartRound}
        />
      </div>

      <footer className="mt-12">
        <KeyboardShortcuts isPaused={isPaused} />
      </footer>

      {hydrated ? (
        <>
          <SettingsDialog
            open={dialogs.isOpen("settings")}
            onOpenChange={dialogs.toggle("settings")}
            onResetRequest={openReset}
          />
          <HelpDialog open={dialogs.isOpen("help")} onOpenChange={dialogs.toggle("help")} />
          <ResetConfirmDialog
            open={dialogs.isOpen("reset")}
            onOpenChange={dialogs.toggle("reset")}
            onConfirm={resetGame}
          />
        </>
      ) : null}
    </main>
  );
}
