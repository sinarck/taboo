"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "@phosphor-icons/react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useGameStore } from "@/stores/game";
import {
  type SettingsFormOutput,
  type SettingsFormValues,
  type Team,
  settingsFormSchema,
} from "@/types/game";

type SettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResetRequest: () => void;
};

function createTeam(name: string): Team {
  return { id: crypto.randomUUID(), name, score: 0 };
}

export function SettingsDialog({ open, onOpenChange, onResetRequest }: SettingsDialogProps) {
  const { settings, teams, applySettings } = useGameStore();

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    control,
  } = useForm<SettingsFormValues, unknown, SettingsFormOutput>({
    resolver: zodResolver(settingsFormSchema),
    values: { ...settings, teams },
    resetOptions: { keepDirtyValues: false },
  });

  const { append, fields, remove } = useFieldArray({ control, name: "teams" });

  const onSubmit = handleSubmit((values) => {
    applySettings({
      settings: {
        pointsPerCorrect: values.pointsPerCorrect,
        pointsPerSkip: values.pointsPerSkip,
        freeSkips: values.freeSkips,
        timerDuration: values.timerDuration,
      },
      teams: values.teams,
    });
    onOpenChange(false);
  });

  const canRemoveTeam = fields.length > 2;
  const canAddTeam = fields.length < 8;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup>
        <DialogTitle className="sr-only">Settings</DialogTitle>

        <form onSubmit={onSubmit} className="contents">
          <DialogPanel className="space-y-6">
            <fieldset className="space-y-3">
              <legend className="font-medium text-foreground text-sm">Teams</legend>
              <ul className="space-y-2">
                {fields.map((field, index) => (
                  <li key={field.id} className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder={`Team ${index + 1}`}
                      aria-invalid={Boolean(errors.teams?.[index]?.name)}
                      aria-label={`Team ${index + 1} name`}
                      {...register(`teams.${index}.name`)}
                    />
                    {canRemoveTeam ? (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => remove(index)}
                        aria-label={`Remove team ${index + 1}`}
                      >
                        <X weight="regular" />
                      </Button>
                    ) : null}
                  </li>
                ))}
              </ul>
              {canAddTeam ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => append(createTeam(`Team ${fields.length + 1}`))}
                  className="-ml-2"
                >
                  <Plus weight="regular" />
                  Add team
                </Button>
              ) : null}
            </fieldset>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>Round (sec)</FieldLabel>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={10}
                  max={300}
                  aria-invalid={Boolean(errors.timerDuration)}
                  {...register("timerDuration")}
                />
                {errors.timerDuration?.message ? (
                  <FieldError>{errors.timerDuration.message}</FieldError>
                ) : null}
              </Field>
              <Field>
                <FieldLabel>Free skips</FieldLabel>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={20}
                  aria-invalid={Boolean(errors.freeSkips)}
                  {...register("freeSkips")}
                />
                {errors.freeSkips?.message ? (
                  <FieldError>{errors.freeSkips.message}</FieldError>
                ) : null}
              </Field>
              <Field>
                <FieldLabel>Correct</FieldLabel>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  aria-invalid={Boolean(errors.pointsPerCorrect)}
                  {...register("pointsPerCorrect")}
                />
                {errors.pointsPerCorrect?.message ? (
                  <FieldError>{errors.pointsPerCorrect.message}</FieldError>
                ) : null}
              </Field>
              <Field>
                <FieldLabel>Skip penalty</FieldLabel>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  aria-invalid={Boolean(errors.pointsPerSkip)}
                  {...register("pointsPerSkip")}
                />
                {errors.pointsPerSkip?.message ? (
                  <FieldError>{errors.pointsPerSkip.message}</FieldError>
                ) : null}
              </Field>
            </div>
          </DialogPanel>

          <DialogFooter className="justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onResetRequest}
              className="text-destructive-foreground"
            >
              Reset game
            </Button>
            <div className="flex items-center gap-2">
              <DialogClose render={<Button variant="outline" size="sm" />}>Cancel</DialogClose>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                Save
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
