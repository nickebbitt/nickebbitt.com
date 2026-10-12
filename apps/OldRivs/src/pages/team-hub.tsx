import snapshot from "../data/generated/team-hub-data.json";
import playerStatistics from "../data/player-stats.json";
import { MatchesSection } from "../components/matches/matches-section";
import { StandingsSection } from "../components/standings/standings-section";
import { PlayerStatsSection } from "../components/player-stats/player-stats-section";
import { DataStatus } from "../components/shared/data-status";
import { useState } from "react";
import { playerStatisticSchema, snapshotSchema } from "../data/schema";
import clubCrest from "../assets/old-rivs-crest.png";

const tabs = [
  { id: "matches", label: "Matches" },
  { id: "standings", label: "Table" },
  { id: "statistics", label: "Stats" }
] as const;

export function TeamHub() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("matches");
  const data = snapshotSchema.parse(snapshot);
  const players = playerStatistics.map((player) => playerStatisticSchema.parse(player));
  return <main className="team-hub"><header className="club-header"><img className="club-crest" src={clubCrest} alt="Old Rivingtonians Sports Club crest" /><p className="eyebrow">Old Rivingtonians Sports Club</p><h1>UNDER 13s</h1><p className="club-motto">Motivate. Inspire. Respect.</p><p>Fixtures, results, league standings, and player statistics.</p></header>
    <DataStatus status={data.source.status} message={data.source.statusMessage} updatedAt={data.source.lastSuccessfulImportAt} />
    <div className="tab-list" role="tablist" aria-label="Team information">
      {tabs.map((tab) => <button key={tab.id} id={`${tab.id}-tab`} className="tab-button" type="button" role="tab" aria-selected={activeTab === tab.id} aria-controls={`${tab.id}-panel`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}
    </div>
    <div id="matches-panel" role="tabpanel" aria-labelledby="matches-tab" hidden={activeTab !== "matches"}><MatchesSection fixtures={data.fixtures} results={data.results} /></div>
    <div id="standings-panel" role="tabpanel" aria-labelledby="standings-tab" hidden={activeTab !== "standings"}><StandingsSection standings={data.standings} /></div>
    <div id="statistics-panel" role="tabpanel" aria-labelledby="statistics-tab" hidden={activeTab !== "statistics"}><PlayerStatsSection statistics={players} /></div>
    <footer>Match information is maintained by the club. Only approved aggregate player statistics are published.</footer>
  </main>;
}
