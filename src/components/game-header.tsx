"use client";

import { GearIcon, QuestionIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { formatGameTime } from "@/utils/time";

type GameHeaderProps = {
  gameStarted: boolean;
  hasPlayed: boolean;
  activeTeamName: string | undefined;
  timeRemaining: number;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
};

export function GameHeader({
  gameStarted,
  hasPlayed,
  activeTeamName,
  timeRemaining,
  onOpenSettings,
  onOpenHelp,
}: GameHeaderProps) {
  const label = hasPlayed ? (activeTeamName ?? "Taboo") : "Taboo";

  return (
    <header className="mb-10 flex items-center justify-between lg:mb-8">
      <h1 className="text-base font-semibold tracking-tight">{label}</h1>
      <div className="flex items-center gap-1">
        {gameStarted ? (
          <span
            aria-live="polite"
            aria-label={`Time remaining ${formatGameTime(timeRemaining)}`}
            className="mr-3 tabular text-sm text-foreground"
          >
            {formatGameTime(timeRemaining)}
          </span>
        ) : null}
        <Button variant="ghost" size="icon" onClick={onOpenHelp} aria-label="How to play">
          <QuestionIcon className="size-4" weight="regular" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="-mr-1"
          onClick={onOpenSettings}
          aria-label="Open settings"
        >
          <GearIcon className="size-4" weight="regular" />
        </Button>
      </div>
    </header>
  );
}
