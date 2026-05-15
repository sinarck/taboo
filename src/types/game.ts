import { z } from "zod";

export const gameSettingsSchema = z.object({
  pointsPerCorrect: z.coerce.number().int().min(1).max(25),
  pointsPerSkip: z.coerce.number().int().min(0).max(25),
  freeSkips: z.coerce.number().int().min(0).max(20),
  timerDuration: z.coerce.number().int().min(10).max(300),
});

export const teamSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Team name is required").max(24),
  score: z.coerce.number().int().min(-999).max(999),
});

export const settingsFormSchema = gameSettingsSchema.extend({
  teams: z.array(teamSchema).min(2).max(8),
});

export type Team = z.infer<typeof teamSchema>;
export type GameSettings = z.infer<typeof gameSettingsSchema>;
export type SettingsFormValues = z.input<typeof settingsFormSchema>;
export type SettingsFormOutput = z.output<typeof settingsFormSchema>;

export type SettingsUpdate = {
  settings: GameSettings;
  teams: Team[];
};

export const DEFAULT_TEAMS: Team[] = [
  { id: "team-1", name: "Team 1", score: 0 },
  { id: "team-2", name: "Team 2", score: 0 },
];

export const DEFAULT_SETTINGS: GameSettings = {
  pointsPerCorrect: 1,
  pointsPerSkip: 1,
  freeSkips: 0,
  timerDuration: 60,
};
