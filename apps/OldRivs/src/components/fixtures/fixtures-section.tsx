import type { Fixture } from "../../data/schema";
import { MatchCard, type Match } from "../matches/matches-section";

export function FixturesSection({ fixtures }: { fixtures: Fixture[] }) {
  const upcomingFixtures = fixtures
    .filter((fixture) => fixture.status === "scheduled" && new Date(fixture.scheduledAt) >= new Date())
    .sort((left, right) => left.scheduledAt.localeCompare(right.scheduledAt));

  return <section aria-labelledby="fixtures-heading">
    <h2 id="fixtures-heading">Fixtures</h2>
    {upcomingFixtures.length ? <div className="fixtures-list">
      {upcomingFixtures.map((fixture) => <MatchCard key={fixture.id} match={{ ...fixture, kind: "fixture", date: fixture.scheduledAt } satisfies Match} label={null} />)}
    </div> : <p role="status">No upcoming fixtures have been published.</p>}
  </section>;
}
