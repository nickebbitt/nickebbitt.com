import { useState } from "react";
import type { PlayerStatistic } from "../../data/schema";

export function PlayerStatsSection({ statistics }: { statistics: PlayerStatistic[] }) {
  const [sortBy, setSortBy] = useState<SortField>("goals");
  const sorted = [...statistics].sort((left, right) =>
    right[sortBy] - left[sortBy] || right.appearances - left.appearances || left.playerName.localeCompare(right.playerName)
  );
  return <section aria-labelledby="players-heading"><h2 id="players-heading">Player statistics</h2>
    {sorted.length === 0 ? <p role="status">Player statistics have not been published.</p> : <><label className="stats-sort">Order by <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortField)}><option value="goals">Goals</option><option value="assists">Assists</option><option value="coachesPlayerOfTheMatchAwards">Coach's POTM</option><option value="parentsPlayerOfTheMatchAwards">Parent's POTM</option></select></label><p className="table-scroll-hint">Swipe sideways to view all statistics.</p><div className="table-wrap player-stats-wrap" tabIndex={0} aria-label="Scrollable player statistics table"><table className="player-stats-table"><thead><tr><th>Player</th><th>Appearances</th><th>Goals</th><th>Assists</th><th>Coach's POTM</th><th>Parent's POTM</th><th>Season</th></tr></thead>
      <tbody>{sorted.map((player) => <tr key={player.playerName}><td>{player.playerName}</td><td>{player.appearances}</td><td>{player.goals}</td><td>{player.assists}</td><td>{player.coachesPlayerOfTheMatchAwards}</td><td>{player.parentsPlayerOfTheMatchAwards}</td><td>{player.season}</td></tr>)}</tbody>
    </table></div></>}
  </section>;
}

type SortField = "goals" | "assists" | "coachesPlayerOfTheMatchAwards" | "parentsPlayerOfTheMatchAwards";
