import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useGameStore } from "@/stores/game";
import { DEFAULT_SETTINGS, DEFAULT_TEAMS } from "@/types/game";

function reset() {
  useGameStore.setState({
    teams: DEFAULT_TEAMS.map((team) => ({ ...team })),
    currentTeamIndex: 0,
    settings: DEFAULT_SETTINGS,
    gameStarted: false,
    roundNumber: 0,
    skipsUsed: 0,
    deck: [],
    usedCardIds: [],
    currentCardId: null,
    previewingPrevious: false,
  });
}

const api = () => useGameStore.getState();

beforeEach(reset);
afterEach(reset);

describe("startRound", () => {
  it("draws a card and flips the game on", () => {
    api().startRound();
    const state = api();
    expect(state.gameStarted).toBe(true);
    expect(state.currentCardId).not.toBeNull();
    expect(state.roundNumber).toBe(1);
    expect(state.skipsUsed).toBe(0);
  });

  it("is idempotent when a round is already in progress", () => {
    api().startRound();
    const cardId = api().currentCardId;
    const round = api().roundNumber;
    api().startRound();
    expect(api().currentCardId).toBe(cardId);
    expect(api().roundNumber).toBe(round);
  });
});

describe("handleCorrect", () => {
  it("rewards the active team and draws the next card", () => {
    api().startRound();
    const firstCardId = api().currentCardId;
    api().handleCorrect();
    expect(api().teams[0]?.score).toBe(DEFAULT_SETTINGS.pointsPerCorrect);
    expect(api().currentCardId).not.toBe(firstCardId);
  });

  it("is a no-op when no round is active", () => {
    api().handleCorrect();
    expect(api().teams[0]?.score).toBe(0);
    expect(api().currentCardId).toBeNull();
  });

  it("uses the configured pointsPerCorrect", () => {
    useGameStore.setState((s) => ({
      settings: { ...s.settings, pointsPerCorrect: 5 },
    }));
    api().startRound();
    api().handleCorrect();
    expect(api().teams[0]?.score).toBe(5);
  });
});

describe("handleSkip", () => {
  it("deducts pointsPerSkip from the active team when no free skips remain", () => {
    api().startRound();
    api().handleSkip();
    expect(api().teams[0]?.score).toBe(-DEFAULT_SETTINGS.pointsPerSkip);
    expect(api().skipsUsed).toBe(1);
  });

  it("burns free skips before charging the team", () => {
    useGameStore.setState((s) => ({
      settings: { ...s.settings, freeSkips: 2, pointsPerSkip: 3 },
    }));
    api().startRound();
    api().handleSkip();
    api().handleSkip();
    expect(api().teams[0]?.score).toBe(0);
    expect(api().skipsUsed).toBe(2);
    api().handleSkip();
    expect(api().teams[0]?.score).toBe(-3);
    expect(api().skipsUsed).toBe(3);
  });

  it("lets scores go negative", () => {
    useGameStore.setState((s) => ({
      settings: { ...s.settings, pointsPerSkip: 2 },
    }));
    api().startRound();
    api().handleSkip();
    api().handleSkip();
    api().handleSkip();
    expect(api().teams[0]?.score).toBe(-6);
  });

  it("is a no-op when no round is active", () => {
    api().handleSkip();
    expect(api().teams[0]?.score).toBe(0);
    expect(api().skipsUsed).toBe(0);
  });

  it("does not deduct when pointsPerSkip is 0", () => {
    useGameStore.setState((s) => ({
      settings: { ...s.settings, pointsPerSkip: 0 },
    }));
    api().startRound();
    api().handleSkip();
    api().handleSkip();
    expect(api().teams[0]?.score).toBe(0);
  });
});

describe("endRound", () => {
  it("rotates the active team and clears round state", () => {
    api().startRound();
    api().endRound();
    expect(api().gameStarted).toBe(false);
    expect(api().currentTeamIndex).toBe(1);
    expect(api().currentCardId).toBeNull();
    expect(api().skipsUsed).toBe(0);
  });

  it("wraps the team index back to 0 after the last team", () => {
    useGameStore.setState({ currentTeamIndex: 1 });
    api().startRound();
    api().endRound();
    expect(api().currentTeamIndex).toBe(0);
  });
});

describe("togglePreviewPrevious", () => {
  it("toggles when at least two cards have been played", () => {
    api().startRound();
    api().handleCorrect();
    expect(api().previewingPrevious).toBe(false);
    api().togglePreviewPrevious();
    expect(api().previewingPrevious).toBe(true);
    api().togglePreviewPrevious();
    expect(api().previewingPrevious).toBe(false);
  });

  it("is a no-op when fewer than two cards have been seen", () => {
    api().startRound();
    api().togglePreviewPrevious();
    expect(api().previewingPrevious).toBe(false);
  });
});

describe("resetGame", () => {
  it("clears scores, round state, and deck back to defaults", () => {
    api().startRound();
    api().handleCorrect();
    api().resetGame();
    const state = api();
    expect(state.teams).toEqual(DEFAULT_TEAMS);
    expect(state.currentTeamIndex).toBe(0);
    expect(state.gameStarted).toBe(false);
    expect(state.roundNumber).toBe(0);
    expect(state.skipsUsed).toBe(0);
    expect(state.currentCardId).toBeNull();
    expect(state.deck).toEqual([]);
  });
});

describe("applySettings", () => {
  it("writes new settings and team list", () => {
    const teams = [
      { id: "a", name: "Alpha", score: 0 },
      { id: "b", name: "Bravo", score: 0 },
      { id: "c", name: "Charlie", score: 0 },
    ];
    api().applySettings({
      settings: { pointsPerCorrect: 3, pointsPerSkip: 2, freeSkips: 1, timerDuration: 90 },
      teams,
    });
    expect(api().settings.pointsPerCorrect).toBe(3);
    expect(api().teams).toEqual(teams);
  });

  it("snaps currentTeamIndex back to 0 if it falls off a shrunk roster", () => {
    useGameStore.setState({
      teams: [
        { id: "a", name: "A", score: 0 },
        { id: "b", name: "B", score: 0 },
        { id: "c", name: "C", score: 0 },
      ],
      currentTeamIndex: 2,
    });
    api().applySettings({
      settings: DEFAULT_SETTINGS,
      teams: DEFAULT_TEAMS.map((team) => ({ ...team })),
    });
    expect(api().currentTeamIndex).toBe(0);
  });
});

describe("drawCard", () => {
  it("never repeats a card the deck remembers as used", () => {
    api().startRound();
    const seen = new Set<number>();
    for (let i = 0; i < 100; i++) {
      const cardId = api().currentCardId;
      if (cardId === null) break;
      expect(seen.has(cardId)).toBe(false);
      seen.add(cardId);
      api().handleCorrect();
    }
    expect(seen.size).toBeGreaterThan(50);
  });
});
