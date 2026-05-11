import { create } from "zustand"
import { persist } from "zustand/middleware"
import { getRandomCards, getTotalCardCount, type TabooCard } from "./taboo-words"
import type { Team, GameSettings } from "./types"

interface GameState {
  // Teams
  teams: Team[]
  currentTeamIndex: number
  roundNumber: number

  // Game state
  gameStarted: boolean
  currentCard: TabooCard | null
  currentCardIndex: number
  cardDeck: TabooCard[]
  usedWords: Set<string> // Track by word to persist across games

  // Timer
  timeRemaining: number
  timerActive: boolean
  isPaused: boolean

  // Settings
  settings: GameSettings

  // Team actions
  addTeam: () => void
  removeTeam: (index: number) => void
  setTeamName: (index: number, name: string) => void
  setTeamScore: (index: number, score: number) => void

  // Game actions
  setGameStarted: (started: boolean) => void
  setCurrentCard: (card: TabooCard | null) => void
  setTimeRemaining: (time: number) => void
  setTimerActive: (active: boolean) => void
  setSettings: (settings: GameSettings) => void
  togglePause: () => void
  resetGame: () => void
  startNewGame: () => void
  startRound: () => void
  handleCorrect: () => void
  handleSkip: () => void
  nextCard: () => void
  endRound: () => void
}

const DEFAULT_TEAMS: Team[] = [
  { name: "Team 1", score: 0 },
  { name: "Team 2", score: 0 },
]

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      teams: DEFAULT_TEAMS,
      currentTeamIndex: 0,
      roundNumber: 0,
      gameStarted: false,
      currentCard: null,
      currentCardIndex: 0,
      cardDeck: [],
      usedWords: new Set(),
      timeRemaining: 60,
      timerActive: false,
      isPaused: false,
      settings: {
        pointsPerCorrect: 1,
        pointsPerSkip: 1,
        timerDuration: 60,
      },

      // Team actions
      addTeam: () => {
        const { teams } = get()
        if (teams.length >= 8) return // Max 8 teams
        set({
          teams: [...teams, { name: `Team ${teams.length + 1}`, score: 0 }],
        })
      },

      removeTeam: (index) => {
        const { teams, currentTeamIndex } = get()
        if (teams.length <= 2) return // Min 2 teams
        const newTeams = teams.filter((_, i) => i !== index)
        set({
          teams: newTeams,
          currentTeamIndex: currentTeamIndex >= newTeams.length ? 0 : currentTeamIndex,
        })
      },

      setTeamName: (index, name) => {
        const { teams } = get()
        const newTeams = [...teams]
        if (newTeams[index]) {
          newTeams[index] = { ...newTeams[index], name: name || `Team ${index + 1}` }
          set({ teams: newTeams })
        }
      },

      setTeamScore: (index, score) => {
        const { teams } = get()
        const newTeams = [...teams]
        if (newTeams[index]) {
          newTeams[index] = { ...newTeams[index], score } // Allow negative scores
          set({ teams: newTeams })
        }
      },

      // Game actions
      setGameStarted: (started) => set({ gameStarted: started }),
      setCurrentCard: (card) => set({ currentCard: card }),
      setTimeRemaining: (time) => set({ timeRemaining: time }),
      setTimerActive: (active) => set({ timerActive: active }),
      setSettings: (settings) => set({ settings }),
      togglePause: () => {
        const { isPaused } = get()
        set({ isPaused: !isPaused })
      },

      resetGame: () => {
        const { settings, teams } = get()
        set({
          teams: teams.map((t) => ({ ...t, score: 0 })),
          currentTeamIndex: 0,
          roundNumber: 0,
          gameStarted: false,
          currentCard: null,
          currentCardIndex: 0,
          cardDeck: [],
          // Keep usedWords to prevent repeats across resets
          timeRemaining: settings.timerDuration,
          timerActive: false,
          isPaused: false,
        })
      },

      startNewGame: () => {
        const { settings, teams } = get()
        set({
          teams: teams.map((t) => ({ ...t, score: 0 })),
          cardDeck: [],
          currentCard: null,
          currentCardIndex: 0,
          currentTeamIndex: 0,
          roundNumber: 0,
          gameStarted: false,
          timeRemaining: settings.timerDuration,
          timerActive: false,
          // Keep usedWords to prevent repeats across new games
          isPaused: false,
        })
      },

      startRound: () => {
        const { cardDeck, usedWords, settings, roundNumber } = get()
        const totalCards = getTotalCardCount()

        if (cardDeck.length === 0) {
          const newDeck = getRandomCards(totalCards, usedWords)
          const firstCard = newDeck[0]
          const newUsedWords = new Set(usedWords)
          if (firstCard) newUsedWords.add(firstCard.word)

          set({
            cardDeck: newDeck,
            currentCardIndex: 0,
            currentCard: firstCard,
            usedWords: newUsedWords,
            gameStarted: true,
            roundNumber: roundNumber + 1,
            timeRemaining: settings.timerDuration,
            timerActive: true,
            isPaused: false,
          })
          return
        }

        const currentIndex = get().currentCardIndex ?? 0
        let nextIndex = currentIndex

        if (nextIndex < cardDeck.length - 1) {
          nextIndex = currentIndex + 1
          const nextCard = cardDeck[nextIndex]
          const newUsedWords = new Set(usedWords)
          if (nextCard) newUsedWords.add(nextCard.word)

          set({
            currentCard: nextCard,
            currentCardIndex: nextIndex,
            usedWords: newUsedWords,
            gameStarted: true,
            roundNumber: roundNumber + 1,
            timeRemaining: settings.timerDuration,
            timerActive: true,
            isPaused: false,
          })
        } else {
          const newDeck = getRandomCards(totalCards, usedWords)
          const firstCard = newDeck[0]
          const newUsedWords = new Set(usedWords)
          if (firstCard) newUsedWords.add(firstCard.word)

          set({
            cardDeck: newDeck,
            currentCardIndex: 0,
            currentCard: firstCard,
            usedWords: newUsedWords,
            gameStarted: true,
            roundNumber: roundNumber + 1,
            timeRemaining: settings.timerDuration,
            timerActive: true,
            isPaused: false,
          })
        }
      },

      nextCard: () => {
        const { cardDeck, currentCardIndex, usedWords } = get()
        const totalCards = getTotalCardCount()

        const nextIndex = currentCardIndex + 1

        if (nextIndex < cardDeck.length) {
          const nextCard = cardDeck[nextIndex]
          const newUsedWords = new Set(usedWords)
          if (nextCard) newUsedWords.add(nextCard.word)

          set({
            currentCard: nextCard,
            currentCardIndex: nextIndex,
            usedWords: newUsedWords,
          })
        } else {
          // Get a fresh deck excluding used words
          const newDeck = getRandomCards(totalCards, usedWords)
          const firstCard = newDeck[0]
          const newUsedWords = new Set(usedWords)
          if (firstCard) newUsedWords.add(firstCard.word)

          set({
            cardDeck: newDeck,
            currentCardIndex: 0,
            currentCard: firstCard,
            usedWords: newUsedWords,
          })
        }
      },

      handleCorrect: () => {
        const { gameStarted, currentTeamIndex, teams, settings } = get()
        if (!gameStarted) return

        const newTeams = [...teams]
        newTeams[currentTeamIndex] = {
          ...newTeams[currentTeamIndex],
          score: newTeams[currentTeamIndex].score + settings.pointsPerCorrect,
        }
        set({ teams: newTeams })

        get().nextCard()
      },

      handleSkip: () => {
        const { gameStarted, currentTeamIndex, teams, settings } = get()
        if (!gameStarted) return

        if (settings.pointsPerSkip > 0) {
          const newTeams = [...teams]
          newTeams[currentTeamIndex] = {
            ...newTeams[currentTeamIndex],
            score: newTeams[currentTeamIndex].score - settings.pointsPerSkip, // Allow negative
          }
          set({ teams: newTeams })
        }

        get().nextCard()
      },

      endRound: () => {
        const { currentTeamIndex, teams } = get()
        const nextTeamIndex = (currentTeamIndex + 1) % teams.length
        set({
          gameStarted: false,
          timerActive: false,
          currentCard: null,
          currentTeamIndex: nextTeamIndex,
          isPaused: false,
        })
      },
    }),
    {
      name: "taboo-game-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const { state } = JSON.parse(str)
          return {
            state: {
              ...state,
              usedWords: new Set(state.usedWords || []),
            },
          }
        },
        setItem: (name, newValue) => {
          const str = JSON.stringify({
            state: {
              ...newValue.state,
              usedWords: Array.from(newValue.state.usedWords),
            },
          })
          localStorage.setItem(name, str)
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)
