import { z } from "zod";

const sourceStatus = z.enum(["current", "stale", "unavailable"]);

const goalContributionSchema = z.object({
  scorer: z.string().min(1),
  assist: z.string().min(1).optional(),
  detail: z.string().min(1).optional()
});

export const fixtureSchema = z.object({
  id: z.string().min(1),
  scheduledAt: z.string().datetime(),
  opponent: z.string().min(1),
  venue: z.string().min(1).optional(),
  competition: z.string().min(1).optional(),
  homeAway: z.enum(["home", "away"]),
  status: z.enum(["scheduled", "postponed", "cancelled", "unknown"])
});

export const resultSchema = z
  .object({
    id: z.string().min(1),
    completedAt: z.string().date(),
    opponent: z.string().min(1),
    homeAway: z.enum(["home", "away"]),
    teamScore: z.number().int().nonnegative().optional(),
    opponentScore: z.number().int().nonnegative().optional(),
    goalContributions: z.array(goalContributionSchema).optional(),
    coachesPlayerOfTheMatch: z.string().min(1).optional(),
    parentsPlayersOfTheMatch: z.array(z.string().min(1)).min(1).optional(),
    status: z.enum(["confirmed", "pending"])
  })
  .superRefine((value, context) => {
    const scoresPresent = value.teamScore !== undefined && value.opponentScore !== undefined;
    if (value.status === "confirmed" && !scoresPresent) {
      context.addIssue({ code: "custom", message: "Confirmed results require both scores." });
    }
    if (value.status === "pending" && (value.teamScore !== undefined || value.opponentScore !== undefined)) {
      context.addIssue({ code: "custom", message: "Pending results cannot contain scores." });
    }
  });

export const leagueEntrySchema = z.object({
  position: z.number().int().positive(),
  teamName: z.string().min(1),
  played: z.number().int().nonnegative(),
  won: z.number().int().nonnegative(),
  drawn: z.number().int().nonnegative(),
  lost: z.number().int().nonnegative(),
  points: z.number().int().nonnegative(),
  isUnder13s: z.boolean()
});

export const standingsSchema = z
  .object({
    status: sourceStatus,
    statusMessage: z.string().min(1).optional(),
    entries: z.array(leagueEntrySchema)
  })
  .superRefine((value, context) => {
    if (["stale", "unavailable"].includes(value.status) && !value.statusMessage) {
      context.addIssue({ code: "custom", message: "Unavailable and stale standings need a status message." });
    }
    if (value.status !== "unavailable" && value.entries.some((entry, index) => value.entries.findIndex((other) => other.position === entry.position) !== index)) {
      context.addIssue({ code: "custom", message: "League positions must be unique." });
    }
  });

export const playerStatisticSchema = z.object({
  playerName: z.string().min(1),
  appearances: z.number().int().nonnegative(),
  goals: z.number().int().nonnegative(),
  assists: z.number().int().nonnegative(),
  coachesPlayerOfTheMatchAwards: z.number().int().nonnegative().default(0),
  parentsPlayerOfTheMatchAwards: z.number().int().nonnegative().default(0),
  season: z.string().min(1)
});

export const snapshotSchema = z
  .object({
    team: z.object({
      displayName: z.string().min(1),
      sourceTeamReference: z.string().min(1)
    }),
    source: z
      .object({
        sourceName: z.string().min(1),
        sourceUrl: z.string().url().optional(),
        lastSuccessfulImportAt: z.string().datetime().optional(),
        status: sourceStatus,
        statusMessage: z.string().min(1).optional()
      })
      .superRefine((value, context) => {
        if (["stale", "unavailable"].includes(value.status) && !value.statusMessage) {
          context.addIssue({ code: "custom", message: "Stale and unavailable sources need a status message." });
        }
      }),
    fixtures: z.array(fixtureSchema),
    results: z.array(resultSchema),
    standings: standingsSchema
  })
  .superRefine((value, context) => {
    if (value.fixtures.some((fixture, index) => value.fixtures.findIndex((other) => other.id === fixture.id) !== index)) {
      context.addIssue({ code: "custom", message: "Fixture IDs must be unique." });
    }
    if (value.results.some((result, index) => value.results.findIndex((other) => other.id === result.id) !== index)) {
      context.addIssue({ code: "custom", message: "Result IDs must be unique." });
    }
  });

export type Fixture = z.infer<typeof fixtureSchema>;
export type Result = z.infer<typeof resultSchema>;
export type LeagueEntry = z.infer<typeof leagueEntrySchema>;
export type Standings = z.infer<typeof standingsSchema>;
export type PlayerStatistic = z.infer<typeof playerStatisticSchema>;
export type TeamHubSnapshot = z.infer<typeof snapshotSchema>;
