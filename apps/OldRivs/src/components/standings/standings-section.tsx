import type { Standings } from "../../data/schema";
import { DataStatus } from "../shared/data-status";

export function StandingsSection({ standings }: { standings: Standings }) {
  return <section aria-labelledby="standings-heading"><h2 id="standings-heading">League table</h2>
    {standings.entries.length === 0 ? <DataStatus status={standings.status} message={standings.statusMessage ?? "A current league table has not been published."} /> :
      <div className="table-wrap"><table className="league-table"><thead><tr><th>Pos</th><th>Team</th><th>P</th><th>Pts</th></tr></thead>
        <tbody>{standings.entries.map((entry) => <tr key={entry.position} className={entry.isUnder13s ? "team-row" : undefined}><td>{entry.position}</td><td>{shortTeamName(entry.teamName)}</td><td>{entry.played}</td><td>{entry.points}</td></tr>)}</tbody>
      </table></div>}
  </section>;
}

function shortTeamName(teamName: string): string {
  return teamName
    .replace("Old Rivingtonians Sports Club U13 Old Ri", "Old Rivingtonians")
    .replace("Astley & Tyldesley J.F.C. U13 Eagles", "Astley & Tyldesley Eagles")
    .replace("Crompton FC Academy U13 Crompton Juniors", "Crompton Juniors")
    .replace("Oxford Grove Junior U13 Tigers", "Oxford Grove Tigers")
    .replace("Little Lever Sports Club Junior U13 Tige", "Little Lever Tigers")
    .replace("Bolton Wyresdale U13 Bolton Wyresdale AF", "Bolton Wyresdale")
    .replace("Abraham Moss Warriors U13 Abraham Moss W", "Abraham Moss")
    .replace("Moss Bank Junior U13 Yellows", "Moss Bank Yellows")
    .replace("Daisy Hill Junior U13 Pumas", "Daisy Hill Pumas");
}
