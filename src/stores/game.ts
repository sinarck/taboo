import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { allCardIds } from "@/data/taboo-cards";
import {
  DEFAULT_SETTINGS,
  DEFAULT_TEAMS,
  type GameSettings,
  type SettingsUpdate,
  type Team,
} from "@/types/game";
import { shuffle } from "@/utils/shuffle";

type GameState = {
  settings: GameSettings;
  teams: Team[];
  currentTeamIndex: number;

  gameStarted: boolean;
  roundNumber: number;
  skipsUsed: number;

  deck: number[];
  usedCardIds: number[];
  currentCardId: number | null;
  previewingPrevious: boolean;

  applySettings: (update: SettingsUpdate) => void;
  startRound: () => void;
  endRound: () => void;
  togglePreviewPrevious: () => void;
  handleCorrect: () => void;
  handleSkip: () => void;
  resetGame: () => void;
};

export const useGameStore = create<GameState>()(
  persist(
    immer((set) => ({
      settings: DEFAULT_SETTINGS,
      teams: DEFAULT_TEAMS,
      currentTeamIndex: 0,

      gameStarted: false,
      roundNumber: 0,
      skipsUsed: 0,

      deck: [],
      usedCardIds: [],
      currentCardId: null,
      previewingPrevious: false,

      applySettings: ({ settings, teams }) =>
        set((state) => {
          state.settings = settings;
          state.teams = teams;
          if (state.currentTeamIndex >= teams.length) state.currentTeamIndex = 0;
        }),

      startRound: () =>
        set((state) => {
          if (state.gameStarted) return;
          if (state.deck.length === 0) state.deck = nextDeck(state.usedCardIds);
          const cardId = state.deck.shift();
          if (cardId === undefined) return;
          state.currentCardId = cardId;
          state.usedCardIds.push(cardId);
          state.gameStarted = true;
          state.roundNumber += 1;
          state.skipsUsed = 0;
          state.previewingPrevious = false;
        }),

      endRound: () =>
        set((state) => {
          if (state.teams.length === 0) return;
          state.currentTeamIndex = (state.currentTeamIndex + 1) % state.teams.length;
          state.gameStarted = false;
          state.previewingPrevious = false;
          state.skipsUsed = 0;
          state.currentCardId = null;
          state.deck = [];
        }),

      togglePreviewPrevious: () =>
        set((state) => {
          // The current card sits at usedCardIds[length - 1], so a previous
          // card only exists once at least two have been drawn.
          if (state.usedCardIds.length < 2) return;
          state.previewingPrevious = !state.previewingPrevious;
        }),

      handleCorrect: () =>
        set((state) => {
          if (!state.gameStarted) return;
          const team = state.teams[state.currentTeamIndex];
          if (!team) return;
          team.score += state.settings.pointsPerCorrect;
          advanceCard(state);
        }),

      handleSkip: () =>
        set((state) => {
          if (!state.gameStarted) return;
          const team = state.teams[state.currentTeamIndex];
          if (!team) return;
          if (state.skipsUsed >= state.settings.freeSkips) {
            team.score -= state.settings.pointsPerSkip;
          }
          state.skipsUsed += 1;
          advanceCard(state);
        }),

      resetGame: () =>
        set((state) => {
          state.teams = DEFAULT_TEAMS.map((team) => ({ ...team }));
          state.currentTeamIndex = 0;
          state.roundNumber = 0;
          state.gameStarted = false;
          state.previewingPrevious = false;
          state.skipsUsed = 0;
          state.currentCardId = null;
          state.deck = [];
          state.usedCardIds = [];
        }),
    })),
    {
      name: "taboo-game-storage",
      version: 6,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") return persistedState;
        const { endAt, pausedMs, isPaused, gameStarted, ...rest } = persistedState as Record<
          string,
          unknown
        >;
        return { ...rest, gameStarted: false };
      },
    },
  ),
);

function advanceCard(state: GameState) {
  if (state.deck.length === 0) state.deck = nextDeck(state.usedCardIds);
  const nextId = state.deck.shift();
  if (nextId === undefined) return;
  state.currentCardId = nextId;
  state.usedCardIds.push(nextId);
}

function nextDeck(usedCardIds: readonly number[]): number[] {
  const used = new Set(usedCardIds);
  const fresh = allCardIds.filter((id) => !used.has(id));
  if (fresh.length > 0) return shuffle(fresh);

  const recentCutoff = Math.floor(allCardIds.length * 0.75);
  const older = usedCardIds.slice(0, recentCutoff);
  const recent = usedCardIds.slice(recentCutoff);
  return [...shuffle(older), ...shuffle(recent)];
}
