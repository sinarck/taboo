"use client";

import { baseShortcuts, pausedShortcuts } from "@/config/shortcuts";

export function KeyboardShortcuts({ isPaused = false }: { isPaused?: boolean }) {
  const shortcuts = isPaused ? [...baseShortcuts, ...pausedShortcuts] : baseShortcuts;
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
      {shortcuts.map(({ key, label }) => (
        <li key={label} className="flex items-center gap-2">
          <kbd className="kbd">{key}</kbd>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
