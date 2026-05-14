import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { allCardIds } from "@/data/taboo-cards"
import {
  DEFAULT_SETTINGS,
  DEFAULT_TEAMS,
  type GameSettings,
  type SettingsUpdate,
  type Team,
} from "@/types/game"
import { shuffle } from "@/utils/shuffle"

type GameState = {
  // settings + teams
  settings: GameSettings
  teams: Team[]
  currentTeamIndex: number

  // round
  gameStarted: boolean
  isPaused: boolean
  roundNumber: number
  skipsUsed: number
  endAt: number | null
  pausedMs: number | null

  // deck
  deck: number[]
  usedCardIds: number[]
  currentCardId: number | null

  // actions
  applySettings: (update: SettingsUpdate) => void
  startRound: () => void
  endRound: () => void
  togglePause: () => void
  handleCorrect: () => void
  handleSkip: () => void
  resetGame: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    immer((set, get) => ({
      settings: DEFAULT_SETTINGS,
      teams: DEFAULT_TEAMS,
      currentTeamIndex: 0,

      gameStarted: false,
      isPaused: false,
      roundNumber: 0,
      skipsUsed: 0,
      endAt: null,
      pausedMs: null,

      deck: [],
      usedCardIds: [],
      currentCardId: null,

      applySettings: ({ settings, teams }) =>
        set((state) => {
          state.settings = settings
          state.teams = teams
          if (state.currentTeamIndex >= teams.length) state.currentTeamIndex = 0
        }),

      startRound: () =>
        set((state) => {
          if (state.gameStarted) return
          if (state.deck.length === 0) {
            state.deck = nextDeck(state.usedCardIds)
          }
          const cardId = state.deck.shift()
          if (cardId === undefined) return
          state.currentCardId = cardId
          state.usedCardIds.push(cardId)
          state.gameStarted = true
          state.isPaused = false
          state.roundNumber += 1
          state.skipsUsed = 0
          state.endAt = Date.now() + state.settings.timerDuration * 1000
          state.pausedMs = null
        }),

      endRound: () =>
        set((state) => {
          if (state.teams.length === 0) return
          state.currentTeamIndex = (state.currentTeamIndex + 1) % state.teams.length
          state.gameStarted = false
          state.isPaused = false
          state.skipsUsed = 0
          state.endAt = null
          state.pausedMs = null
          state.currentCardId = null
          state.deck = []
        }),

      togglePause: () =>
        set((state) => {
          if (!state.gameStarted) return
          if (state.isPaused && state.pausedMs !== null) {
            state.endAt = Date.now() + state.pausedMs
            state.pausedMs = null
            state.isPaused = false
          } else if (!state.isPaused && state.endAt !== null) {
            state.pausedMs = Math.max(0, state.endAt - Date.now())
            state.endAt = null
            state.isPaused = true
          }
        }),

      handleCorrect: () =>
        set((state) => {
          if (!state.gameStarted) return
          const team = state.teams[state.currentTeamIndex]
          if (!team) return
          team.score += state.settings.pointsPerCorrect
          advanceCard(state)
        }),

      handleSkip: () =>
        set((state) => {
          if (!state.gameStarted) return
          const team = state.teams[state.currentTeamIndex]
          if (!team) return
          if (state.skipsUsed >= state.settings.freeSkips) {
            team.score -= state.settings.pointsPerSkip
          }
          state.skipsUsed += 1
          advanceCard(state)
        }),

      resetGame: () =>
        set((state) => {
          state.teams = DEFAULT_TEAMS.map((team) => ({ ...team }))
          state.currentTeamIndex = 0
          state.roundNumber = 0
          state.gameStarted = false
          state.isPaused = false
          state.skipsUsed = 0
          state.endAt = null
          state.pausedMs = null
          state.currentCardId = null
          state.deck = []
          state.usedCardIds = []
        }),
    })),
    {
      name: "taboo-game-storage",
      version: 5,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

// Draw the next card into state, refilling and reshuffling the deck on demand.
function advanceCard(state: GameState) {
  if (state.deck.length === 0) state.deck = nextDeck(state.usedCardIds)
  const nextId = state.deck.shift()
  if (nextId === undefined) return
  state.currentCardId = nextId
  state.usedCardIds.push(nextId)
}

// Build a fresh shuffled deck, biased so recently-played cards land near the
// bottom on wrap so repeats stay rare across sessions.
function nextDeck(usedCardIds: readonly number[]): number[] {
  const used = new Set(usedCardIds)
  const fresh = allCardIds.filter((id) => !used.has(id))
  if (fresh.length > 0) return shuffle(fresh)

  // All cards have been played — wrap. Push the most-recent quarter to the
  // bottom of the new shuffle so they don't reappear immediately.
  const recentCutoff = Math.floor(allCardIds.length * 0.75)
  const older = usedCardIds.slice(0, recentCutoff)
  const recent = usedCardIds.slice(recentCutoff)
  return [...shuffle(older), ...shuffle(recent)]
}
