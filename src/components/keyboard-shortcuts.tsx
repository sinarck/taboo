"use client"

import { formatForDisplay, type RegisterableHotkey } from "@tanstack/react-hotkeys"

interface ShortcutEntry {
  hotkey: RegisterableHotkey
  label: string
}

const shortcuts: readonly ShortcutEntry[] = [
  { hotkey: "Space", label: "Correct" },
  { hotkey: "S", label: "Skip" },
  { hotkey: "P", label: "Pause" },
  { hotkey: { key: "/", shift: true }, label: "Help" },
]

const displayOverrides: Record<string, string> = {
  Space: "Space",
  "Shift+/": "?",
}

function displayFor(hotkey: RegisterableHotkey): string {
  const formatted = formatForDisplay(hotkey, { useSymbols: false })
  return displayOverrides[formatted] ?? formatted
}

export function KeyboardShortcuts() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
      {shortcuts.map(({ hotkey, label }) => (
        <li key={label} className="flex items-center gap-2">
          <kbd className="kbd">{displayFor(hotkey)}</kbd>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  )
}
