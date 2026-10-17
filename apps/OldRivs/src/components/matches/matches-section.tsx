import { useState } from "react";
import type { Fixture, Result } from "../../data/schema";

type Match = ({ kind: "fixture"; date: string } & Fixture) | ({ kind: "result"; date: string } & Result);

export function MatchesSection({ fixtures, results }: { fixtures: Fixture[]; results: Result[] }) {
  const [expandedMatch, setExpandedMatch] = useState<string>();
  const now = new Date();
  const completedResults = results
    .map((result): Match => ({ ...result, kind: "result", date: result.completedAt }))
    .filter((match) => match.status === "confirmed")
    .sort((left, right) => right.date.localeCompare(left.date));
  const completed = completedResults[0];
  const next = fixtures
    .map((fixture): Match => ({ ...fixture, kind: "fixture", date: fixture.scheduledAt }))
    .filter((match) => match.status === "scheduled" && new Date(match.date) >= now)
    .sort((left, right) => left.date.localeCompare(right.date))[0];

  return <section aria-labelledby="matches-heading">
    <h2 id="matches-heading">Matches</h2>
    {!completed && !next ? <p role="status">No recent result or upcoming match has been published.</p> : <div className="match-list">
      {next && <MatchCard match={next} />}
      {completed && <MatchCard match={completed} expanded={expandedMatch === completed.id} onExpand={() => setExpandedMatch((id) => id === completed.id ? undefined : completed.id)} />}
    </div>}
    {completedResults.length > 1 && <div className="results-history" aria-label="All results">
      {completedResults.slice(1).map((result) => <MatchCard key={result.id} match={result} label={null} expanded={expandedMatch === result.id} onExpand={() => setExpandedMatch((id) => id === result.id ? undefined : result.id)} />)}
    </div>}
  </section>;
}

function MatchCard({ match, label, expanded, onExpand }: { match: Match; label?: string | null; expanded?: boolean; onExpand?: () => void }) {
  const isResult = match.kind === "result";
  return <article className={`match-card ${isResult ? "match-card--result" : "match-card--fixture"}`}>
    {label !== null && <p className="match-label">{label ?? (isResult ? "Latest result" : "Next match")}</p>}
    <strong>{match.opponent}</strong>
    {isResult && match.status === "confirmed" && <span className="match-score">Result: {match.teamScore} - {match.opponentScore}</span>}
    <span>{new Date(match.date).toLocaleDateString(undefined, { dateStyle: "full" })}</span>
    <span>Location: {match.homeAway === "home" ? "Home" : "Away"}</span>
    {!isResult && match.venue && <span>{match.venue}</span>}
    {isResult && match.goalContributions?.length ? <button className="expand-button match-expand" type="button" aria-expanded={expanded} onClick={onExpand}>
      {expanded ? "Hide match statistics" : "Show match statistics"}
    </button> : null}
    {isResult && expanded && <dl className="match-statistics">
      {match.goalContributions?.map((goal, index) => <div key={`${goal.scorer}-${index}`}><dt>Goal</dt><dd>{goal.scorer}{goal.assist ? ` (${goal.assist})` : ""}{goal.detail ? ` (${goal.detail})` : ""}</dd></div>)}
      {match.coachesPlayerOfTheMatch && <div><dt>Coach's POTM</dt><dd>{match.coachesPlayerOfTheMatch}</dd></div>}
      {match.parentsPlayersOfTheMatch && <div><dt>Parent's POTM</dt><dd>{match.parentsPlayersOfTheMatch.join(", ")}</dd></div>}
    </dl>}
  </article>;
}
