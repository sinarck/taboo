import { describe, expect, it } from "vite-plus/test";
import { shuffle } from "@/utils/shuffle";

describe("shuffle", () => {
  it("preserves length and elements", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const out = shuffle(input);
    expect(out).toHaveLength(input.length);
    expect(out.slice().sort((a, b) => a - b)).toEqual(input);
  });

  it("does not mutate the input", () => {
    const input = [1, 2, 3, 4, 5];
    const snapshot = input.slice();
    shuffle(input);
    expect(input).toEqual(snapshot);
  });

  it("returns a different order most of the time for non-trivial inputs", () => {
    const input = Array.from({ length: 50 }, (_, i) => i);
    let identical = 0;
    for (let i = 0; i < 30; i++) {
      const out = shuffle(input);
      if (out.every((value, idx) => value === input[idx])) identical += 1;
    }
    // Probability of a 50-item Fisher-Yates returning identity is ~1/50! — basically zero.
    expect(identical).toBe(0);
  });

  it("approaches a uniform distribution over many shuffles", () => {
    // Track how often each value lands in position 0 across many shuffles.
    const input = [0, 1, 2, 3, 4];
    const trials = 20_000;
    const counts = Array.from({ length: input.length }, () => 0);
    for (let i = 0; i < trials; i++) {
      const winner = shuffle(input)[0];
      if (winner === undefined) continue;
      counts[winner] = (counts[winner] ?? 0) + 1;
    }
    // Expect each value to land in position 0 ≈ trials / input.length times.
    const expected = trials / input.length;
    for (const observed of counts) {
      expect(Math.abs(observed - expected)).toBeLessThan(expected * 0.1);
    }
  });

  it("handles empty and singleton inputs", () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(["only"])).toEqual(["only"]);
  });
});
