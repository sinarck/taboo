export type Shortcut = {
  readonly key: string;
  readonly label: string;
};

export const baseShortcuts: readonly Shortcut[] = [
  { key: "Space", label: "Correct" },
  { key: "S", label: "Skip" },
  { key: "P", label: "Pause" },
  { key: "?", label: "Help" },
];

// Shown only while the current round is paused — Backspace previews the
// previous card and is only active in that state to avoid mis-presses.
export const pausedShortcuts: readonly Shortcut[] = [{ key: "Backspace", label: "Previous" }];
