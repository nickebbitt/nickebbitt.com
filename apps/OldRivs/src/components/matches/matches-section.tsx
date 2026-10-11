import { useState } from "react";
import type { Fixture, Result } from "../../data/schema";

type Match = ({ kind: "fixture"; date: string } & Fixture) | ({ kind: "result"; date: string } & Result);

export function MatchesSection({ fixtures, results }: { fixtures: Fixture[]; results: Result[] }) {
  const [expandedMatch, setExpandedMatch] = useState<string>();
  const now = new Date();
  const completed = results
    .map((result): Match => ({ ...result, kind: "result", date: result.completedAt }))
    .filter((match) => new Date(`${match.date}T23:59:59`) < now)
    .sort((left, right) => right.date.localeCompare(left.date))[0];
  const next = fixtures
    .map((fixture): Match => ({ ...fixture, kind: "fixture", date: fixture.scheduledAt }))
    .filter((match) => match.status === "scheduled" && new Date(match.date) >= now)
    .sort((left, right) => left.date.localeCompare(right.date))[0];

  return <section aria-labelledby="matches-heading">
    <h2 id="matches-heading">Matches</h2>
    {!completed && !next ? <p role="status">No recent result or upcoming match has been published.</p> : <div className="match-list">
      {completed && <MatchCard match={completed} expanded={expandedMatch === completed.id} onExpand={() => setExpandedMatch((id) => id === completed.id ? undefined : completed.id)} />}
      {next && <MatchCard match={next} />}
    </div>}
  </section>;
}

function MatchCard({ match, expanded, onExpand }: { match: Match; expanded?: boolean; onExpand?: () => void }) {
  const isResult = match.kind === "result";
  return <article className="match-card">
    <p className="match-label">{isResult ? "Latest result" : "Next match"}</p>
    <strong>Old Rivingtonians U13 {isResult && match.status === "confirmed" ? `${match.teamScore} - ${match.opponentScore}` : "vs"} {match.opponent}</strong>
    <span>{new Date(match.date).toLocaleDateString(undefined, { dateStyle: "full" })}</span>
    <span>{isResult ? match.status : `${match.homeAway === "home" ? "Home" : "Away"} · ${match.status}`}</span>
    {!isResult && match.venue && <span>{match.venue}</span>}
    {isResult && match.goalContributions?.length ? <button className="expand-button match-expand" type="button" aria-expanded={expanded} onClick={onExpand}>
      {expanded ? "Hide match statistics" : "Show match statistics"}
    </button> : null}
    {isResult && expanded && <dl className="match-statistics">
      {match.goalContributions?.map((goal, index) => <div key={`${goal.scorer}-${index}`}><dt>Goal</dt><dd>{goal.scorer}{goal.assist ? ` — assist: ${goal.assist}` : ""}{goal.detail ? ` (${goal.detail})` : ""}</dd></div>)}
      {match.coachesPlayerOfTheMatch && <div><dt>Coach's POTM</dt><dd>{match.coachesPlayerOfTheMatch}</dd></div>}
      {match.parentsPlayersOfTheMatch && <div><dt>Parent's POTM</dt><dd>{match.parentsPlayersOfTheMatch.join(", ")}</dd></div>}
    </dl>}
  </article>;
}
