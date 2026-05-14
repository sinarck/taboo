"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, X } from "@phosphor-icons/react"
import type { ReactNode } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGameStore } from "@/stores/game"
import {
  type SettingsFormOutput,
  type SettingsFormValues,
  type Team,
  settingsFormSchema,
} from "@/types/game"

type SettingsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onResetRequest: () => void
}

function createTeam(name: string): Team {
  return { id: crypto.randomUUID(), name, score: 0 }
}

export function SettingsDialog({
  open,
  onOpenChange,
  onResetRequest,
}: SettingsDialogProps) {
  const { settings, teams, applySettings } = useGameStore()

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    control,
  } = useForm<SettingsFormValues, unknown, SettingsFormOutput>({
    resolver: zodResolver(settingsFormSchema),
    values: { ...settings, teams },
    resetOptions: { keepDirtyValues: false },
  })

  const { append, fields, remove } = useFieldArray({ control, name: "teams" })

  const onSubmit = handleSubmit((values) => {
    applySettings({
      settings: {
        pointsPerCorrect: values.pointsPerCorrect,
        pointsPerSkip: values.pointsPerSkip,
        freeSkips: values.freeSkips,
        timerDuration: values.timerDuration,
      },
      teams: values.teams,
    })
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-h-[90dvh] overflow-y-auto p-0">
        <header className="flex items-center justify-between px-6 py-4">
          <DialogTitle>Settings</DialogTitle>
          <DialogClose
            render={
              <Button variant="ghost" size="icon" aria-label="Close settings" />
            }
          >
            <X className="size-4" weight="regular" />
          </DialogClose>
        </header>

        <form onSubmit={onSubmit} className="px-6 pb-6">
          <Section label="teams">
            <ul className="space-y-2">
              {fields.map((field, index) => (
                <li key={field.id}>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder={`Team ${index + 1}`}
                      className="flex-1"
                      aria-invalid={Boolean(errors.teams?.[index]?.name)}
                      {...register(`teams.${index}.name`)}
                    />
                    {fields.length > 2 ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        aria-label={`Remove team ${index + 1}`}
                      >
                        <X className="size-4" weight="regular" />
                      </Button>
                    ) : null}
                  </div>
                  {errors.teams?.[index]?.name?.message ? (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.teams[index]?.name?.message}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
            {fields.length < 8 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => append(createTeam(`Team ${fields.length + 1}`))}
                className="mt-3 -ml-2"
              >
                <Plus className="size-3.5" weight="regular" />
                Add team
              </Button>
            ) : null}
          </Section>

          <Section label="round">
            <Field id="timerDuration" label="Duration" suffix="seconds" error={errors.timerDuration?.message}>
              <Input
                id="timerDuration"
                type="number"
                inputMode="numeric"
                min={10}
                max={300}
                aria-invalid={Boolean(errors.timerDuration)}
                {...register("timerDuration")}
              />
            </Field>
          </Section>

          <Section label="scoring">
            <div className="grid grid-cols-2 gap-4">
              <Field id="pointsPerCorrect" label="Per correct" error={errors.pointsPerCorrect?.message}>
                <Input
                  id="pointsPerCorrect"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  aria-invalid={Boolean(errors.pointsPerCorrect)}
                  {...register("pointsPerCorrect")}
                />
              </Field>
              <Field id="pointsPerSkip" label="Per skip" error={errors.pointsPerSkip?.message}>
                <Input
                  id="pointsPerSkip"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  aria-invalid={Boolean(errors.pointsPerSkip)}
                  {...register("pointsPerSkip")}
                />
              </Field>
              <Field id="freeSkips" label="Free skips" suffix="per round" error={errors.freeSkips?.message}>
                <Input
                  id="freeSkips"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={20}
                  aria-invalid={Boolean(errors.freeSkips)}
                  {...register("freeSkips")}
                />
              </Field>
            </div>
          </Section>

          <Section label="scores">
            <ul className="space-y-2">
              {fields.map((field, index) => (
                <li key={field.id} className="flex items-center gap-3 text-sm">
                  <span className="w-28 shrink-0 truncate text-muted-foreground">
                    {field.name || `Team ${index + 1}`}
                  </span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    aria-invalid={Boolean(errors.teams?.[index]?.score)}
                    {...register(`teams.${index}.score`)}
                  />
                </li>
              ))}
            </ul>
          </Section>

          <Section label="reset">
            <Button
              type="button"
              variant="destructive-outline"
              size="sm"
              onClick={onResetRequest}
            >
              Reset game
            </Button>
          </Section>

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose render={<Button variant="outline" size="lg" />}>
              Cancel
            </DialogClose>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </DialogPopup>
    </Dialog>
  )
}

type SectionProps = {
  label: string
  children: ReactNode
}

function Section({ label, children }: SectionProps) {
  return (
    <section className="mb-6 last:mb-0">
      <h3 className="section-label mb-3">{label}</h3>
      {children}
    </section>
  )
}

type FieldProps = {
  id: string
  label: string
  suffix?: string
  error?: string | undefined
  children: ReactNode
}

function Field({ id, label, suffix, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm text-foreground">
        {label}
        {suffix ? <span className="ml-2 text-muted-foreground">{suffix}</span> : null}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
