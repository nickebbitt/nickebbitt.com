import { useEffect, useState } from "react";
import type { PlayerStatistic } from "../../data/schema";

export function PlayerStatsSection({ statistics }: { statistics: PlayerStatistic[] }) {
  const [view, setView] = useState<StatsView>("attacking");
  const [sort, setSort] = useState<Sort>({ field: "goals", direction: "descending" });
  const [compact, setCompact] = useState(false);
  const [compactField, setCompactField] = useState<SortField>("goals");
  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia("(max-width: 42rem)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const viewFields = view === "attacking"
    ? [{ field: "goals" as const, label: "Goals" }, { field: "assists" as const, label: "Assists" }]
    : [{ field: "coachesPlayerOfTheMatchAwards" as const, label: "Coach's POTM" }, { field: "parentsPlayerOfTheMatchAwards" as const, label: "Parent's POTM" }];
  const visibleFields = compact ? allFields.filter(({ field }) => field === compactField) : viewFields;
  const sorted = [...statistics].sort((left, right) => {
    const direction = sort.direction === "descending" ? -1 : 1;
    const difference = direction * (left[sort.field] - right[sort.field]);
    return difference || right.appearances - left.appearances || left.playerName.localeCompare(right.playerName);
  });
  const setSortField = (field: SortField) => setSort((current) => ({
    field,
    direction: current.field === field && current.direction === "descending" ? "ascending" : "descending"
  }));
  const sortLabel = (field: SortField) => sort.field === field ? sort.direction === "descending" ? " ↓" : " ↑" : "";
  return <section aria-labelledby="players-heading"><h2 id="players-heading">Player statistics</h2>
    {sorted.length === 0 ? <p role="status">Player statistics have not been published.</p> : <>{compact ? <label className="stats-sort">Stat <select value={compactField} onChange={(event) => { const field = event.target.value as SortField; setCompactField(field); setSort({ field, direction: "descending" }); }}>{allFields.map(({ field, label }) => <option key={field} value={field}>{label}</option>)}</select></label> : <label className="stats-sort">View <select value={view} onChange={(event) => { const nextView = event.target.value as StatsView; setView(nextView); setSort({ field: nextView === "attacking" ? "goals" : "coachesPlayerOfTheMatchAwards", direction: "descending" }); }}><option value="attacking">Goals & assists</option><option value="awards">POTM awards</option></select></label>}<p className="table-scroll-hint">Tap a statistic heading to change its order.</p><div className="table-wrap player-stats-wrap"><table className="player-stats-table"><thead><tr><th>Player</th><th><button type="button" onClick={() => setSortField("appearances")}>Appearances{sortLabel("appearances")}</button></th>{visibleFields.map(({ field, label }) => <th key={field}><button type="button" onClick={() => setSortField(field)}>{label}{sortLabel(field)}</button></th>)}</tr></thead>
      <tbody>{sorted.map((player) => <tr key={player.playerName}><td>{player.playerName}</td><td>{player.appearances}</td>{visibleFields.map(({ field }) => <td key={field}>{player[field]}</td>)}</tr>)}</tbody>
    </table></div></>}
  </section>;
}

type StatsView = "attacking" | "awards";
type SortField = "appearances" | "goals" | "assists" | "coachesPlayerOfTheMatchAwards" | "parentsPlayerOfTheMatchAwards";
type Sort = { field: SortField; direction: "ascending" | "descending" };

const allFields = [
  { field: "goals" as const, label: "Goals" },
  { field: "assists" as const, label: "Assists" },
  { field: "coachesPlayerOfTheMatchAwards" as const, label: "Coach's POTM" },
  { field: "parentsPlayerOfTheMatchAwards" as const, label: "Parent's POTM" }
];
