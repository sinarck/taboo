"use client"

import { Kbd } from "@/components/ui/kbd"

const shortcuts = [
  { key: "Space", label: "Correct" },
  { key: "S", label: "Skip" },
  { key: "P", label: "Pause" },
  { key: "?", label: "Settings" },
]

export function KeyboardShortcuts() {
  return (
    <div className="hidden sm:flex items-center justify-center gap-6 md:gap-8 py-4 text-sm">
      {shortcuts.map(({ key, label }) => (
        <div key={key} className="flex items-center gap-2">
          <Kbd>{key}</Kbd>
          <span className="text-muted-foreground/60">{label}</span>
        </div>
      ))}
    </div>
  )
}
