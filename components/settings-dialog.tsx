"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Plus, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Team, GameSettings } from "@/lib/types"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: GameSettings
  onSettingsChange: (settings: GameSettings) => void
  teams: Team[]
  onAddTeam: () => void
  onRemoveTeam: (index: number) => void
  onTeamNameChange: (index: number, name: string) => void
  onTeamScoreChange: (index: number, score: number) => void
  onNewGame: () => void
}

export function SettingsDialog({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
  teams,
  onAddTeam,
  onRemoveTeam,
  onTeamNameChange,
  onTeamScoreChange,
  onNewGame,
}: SettingsDialogProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Game Settings</DialogTitle>
          <DialogDescription>Customize the rules for your Taboo game</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Teams Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Teams</Label>
              {teams.length < 8 && (
                <Button variant="ghost" size="sm" onClick={onAddTeam} className="h-8 px-2">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Team
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {teams.map((team, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={team.name}
                    onChange={(e) => onTeamNameChange(index, e.target.value)}
                    placeholder={`Team ${index + 1}`}
                    className="flex-1"
                  />
                  {teams.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveTeam(index)}
                      className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="timerDuration">Round Timer (seconds)</Label>
            <Input
              id="timerDuration"
              type="number"
              min="10"
              max="300"
              value={settings.timerDuration || ""}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  timerDuration: e.target.value === "" ? 0 : Number.parseInt(e.target.value),
                })
              }
              onBlur={(e) => {
                if (!e.target.value || Number.parseInt(e.target.value) < 10) {
                  onSettingsChange({ ...settings, timerDuration: 60 })
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pointsPerCorrect">Points per Correct Answer</Label>
            <Input
              id="pointsPerCorrect"
              type="number"
              min="1"
              value={settings.pointsPerCorrect || ""}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  pointsPerCorrect: e.target.value === "" ? 0 : Number.parseInt(e.target.value),
                })
              }
              onBlur={(e) => {
                if (!e.target.value || Number.parseInt(e.target.value) < 1) {
                  onSettingsChange({ ...settings, pointsPerCorrect: 1 })
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pointsPerSkip">Points Deducted per Skip</Label>
            <Input
              id="pointsPerSkip"
              type="number"
              min="0"
              value={settings.pointsPerSkip ?? ""}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  pointsPerSkip: e.target.value === "" ? 0 : Number.parseInt(e.target.value),
                })
              }
            />
          </div>

          <Separator />

          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
                <span className="text-sm font-semibold">Advanced</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground">Edit Scores</Label>
                {teams.map((team, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-24 truncate">{team.name}</span>
                    <Input
                      type="number"
                      min="0"
                      value={team.score}
                      onChange={(e) => onTeamScoreChange(index, Number.parseInt(e.target.value) || 0)}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>

              <Separator />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    New Game
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Start a new game?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset all scores and start fresh. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        onNewGame()
                        onOpenChange(false)
                      }}
                    >
                      Start New Game
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
