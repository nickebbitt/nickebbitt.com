import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { z } from "zod";
import { fixtureSchema, leagueEntrySchema, playerStatisticSchema, resultSchema, snapshotSchema, type PlayerStatistic, type TeamHubSnapshot } from "../data/schema.js";

const contribution = z.object({ scorer: z.string().min(1), assist: z.string().min(1).optional(), detail: z.string().min(1).optional() }).strict();
const match = z.object({
  matchId: z.string().min(1), scheduledAt: z.string().datetime(), completedAt: z.string().date().optional(),
  opponent: z.string().min(1), homeAway: z.enum(["home", "away"]),
  status: z.enum(["scheduled", "postponed", "cancelled", "unknown", "confirmed", "pending"]),
  teamScore: z.number().int().nonnegative().optional(), opponentScore: z.number().int().nonnegative().optional(),
  venue: z.string().min(1).optional(), competition: z.string().min(1).optional(), contributions: z.array(contribution).optional(),
  coachesPlayerOfTheMatch: z.string().min(1).optional(), parentsPlayersOfTheMatch: z.array(z.string().min(1)).min(1).optional()
}).strict().superRefine((value, context) => {
  if (value.status === "confirmed" && (!value.completedAt || value.teamScore === undefined || value.opponentScore === undefined)) context.addIssue({ code: "custom", message: "Confirmed matches require completedAt and both scores." });
  if (value.status !== "confirmed" && (value.teamScore !== undefined || value.opponentScore !== undefined)) context.addIssue({ code: "custom", message: "Only confirmed matches can contain scores." });
  if (value.contributions && value.status === "confirmed" && value.contributions.length !== value.teamScore) context.addIssue({ code: "custom", message: "Contributions must equal teamScore." });
});
const localUpdateSchema = z.object({
  team: z.object({ displayName: z.string().min(1), sourceTeamReference: z.string().min(1) }).strict(),
  matches: z.array(match).superRefine((items, context) => items.forEach((item, index) => {
    if (items.findIndex((other) => other.matchId === item.matchId) !== index) context.addIssue({ code: "custom", message: "matchId values must be unique.", path: [index, "matchId"] });
  })),
  standings: z.array(leagueEntrySchema),
  playerStatistics: z.array(playerStatisticSchema)
}).strict();

export type LocalTeamUpdate = z.infer<typeof localUpdateSchema>;

export function createPublishedLocalData(input: unknown): { snapshot: TeamHubSnapshot; playerStatistics: PlayerStatistic[] } {
  const update = localUpdateSchema.parse(input);
  const fixtures = update.matches.filter((item) => !["confirmed", "pending"].includes(item.status)).map((item) => fixtureSchema.parse({ id: item.matchId, scheduledAt: item.scheduledAt, opponent: item.opponent, homeAway: item.homeAway, status: item.status, venue: item.venue, competition: item.competition }));
  const results = update.matches.filter((item) => ["confirmed", "pending"].includes(item.status)).map((item) => resultSchema.parse({ id: item.matchId, completedAt: item.completedAt, opponent: item.opponent, status: item.status, teamScore: item.teamScore, opponentScore: item.opponentScore, goalContributions: item.contributions, coachesPlayerOfTheMatch: item.coachesPlayerOfTheMatch, parentsPlayersOfTheMatch: item.parentsPlayersOfTheMatch }));
  const awardTotals = new Map<string, { coaches: number; parents: number }>();
  for (const item of update.matches) {
    for (const name of item.coachesPlayerOfTheMatch?.split(",").map((value) => value.trim()) ?? []) {
      awardTotals.set(name, { coaches: (awardTotals.get(name)?.coaches ?? 0) + 1, parents: awardTotals.get(name)?.parents ?? 0 });
    }
    for (const name of item.parentsPlayersOfTheMatch ?? []) {
      awardTotals.set(name, { coaches: awardTotals.get(name)?.coaches ?? 0, parents: (awardTotals.get(name)?.parents ?? 0) + 1 });
    }
  }
  const playerStatistics = update.playerStatistics.map((player) => ({
    ...player,
    coachesPlayerOfTheMatchAwards: awardTotals.get(player.playerName)?.coaches ?? 0,
    parentsPlayerOfTheMatchAwards: awardTotals.get(player.playerName)?.parents ?? 0
  }));
  return { snapshot: snapshotSchema.parse({ team: update.team, source: { sourceName: "Club-maintained local data", lastSuccessfulImportAt: new Date().toISOString(), status: "current" }, fixtures, results, standings: { status: "current", entries: update.standings } }), playerStatistics };
}

export async function publishLocalData(sourcePath: string, outputDirectory: string): Promise<void> {
  const source = JSON.parse(await readFile(sourcePath, "utf8"));
  await publishAtomically(outputDirectory, createPublishedLocalData(source));
}

async function publishAtomically(outputDirectory: string, data: { snapshot: TeamHubSnapshot; playerStatistics: PlayerStatistic[] }): Promise<void> {
  const paths = [join(outputDirectory, "generated", "team-hub-data.json"), join(outputDirectory, "player-stats.json")];
  const token = `${process.pid}-${Date.now()}`;
  const temporary = paths.map((path) => `${path}.${token}.tmp`);
  const backups = paths.map((path) => `${path}.${token}.bak`);
  await mkdir(dirname(paths[0]), { recursive: true });
  await Promise.all([writeFile(temporary[0], `${JSON.stringify(data.snapshot, null, 2)}\n`), writeFile(temporary[1], `${JSON.stringify(data.playerStatistics, null, 2)}\n`)]);
  try {
    await Promise.all(paths.map((path, index) => rename(path, backups[index])));
    await Promise.all(temporary.map((path, index) => rename(path, paths[index])));
    await Promise.all(backups.map((path) => rm(path)));
  } catch (error) {
    await Promise.allSettled(paths.map((path) => rm(path)));
    await Promise.allSettled(backups.map((path, index) => rename(path, paths[index])));
    throw error;
  } finally {
    await Promise.allSettled(temporary.map((path) => rm(path)));
  }
}
