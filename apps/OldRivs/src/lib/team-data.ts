import { snapshotSchema, type Fixture, type PlayerStatistic, type TeamHubSnapshot } from "../data/schema";

export function upcomingFixtures(fixtures: Fixture[]): Fixture[] {
  return fixtures
    .filter((fixture) => fixture.status === "scheduled")
    .sort((left, right) => left.scheduledAt.localeCompare(right.scheduledAt));
}

export function publishedFixtures(fixtures: Fixture[]): Fixture[] {
  return [...fixtures].sort((left, right) => left.scheduledAt.localeCompare(right.scheduledAt));
}

export function sortedPlayerStatistics(statistics: PlayerStatistic[]): PlayerStatistic[] {
  return [...statistics].sort(
    (left, right) => right.goals - left.goals || right.assists - left.assists || left.playerName.localeCompare(right.playerName)
  );
}

export function validateSnapshot(snapshot: unknown): TeamHubSnapshot {
  return snapshotSchema.parse(snapshot);
}
