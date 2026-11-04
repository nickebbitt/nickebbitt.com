import { describe, expect, it } from "vitest";
import { createPublishedLocalData } from "../../../src/lib/local-data-publisher";

describe("createPublishedLocalData", () => {
  it("attributes confirmed clean sheets to Bailey", () => {
    const { playerStatistics } = createPublishedLocalData({
      team: { displayName: "Old Rivingtonians Under 13s", sourceTeamReference: "ORFC U13" },
      matches: [
        {
          matchId: "clean-sheet",
          scheduledAt: "2026-10-04T10:00:00.000Z",
          completedAt: "2026-10-04",
          opponent: "Rivals",
          homeAway: "home",
          status: "confirmed",
          teamScore: 2,
          opponentScore: 0
        },
        {
          matchId: "conceded",
          scheduledAt: "2026-10-11T10:00:00.000Z",
          completedAt: "2026-10-11",
          opponent: "More rivals",
          homeAway: "away",
          status: "confirmed",
          teamScore: 2,
          opponentScore: 1
        }
      ],
      standings: [],
      playerStatistics: [
        { playerName: "Bailey", appearances: 2, goals: 0, assists: 0, season: "2026/27" },
        { playerName: "George", appearances: 2, goals: 2, assists: 0, season: "2026/27" }
      ]
    });

    expect(playerStatistics).toEqual(expect.arrayContaining([
      expect.objectContaining({ playerName: "Bailey", cleanSheets: 1 }),
      expect.objectContaining({ playerName: "George", cleanSheets: 0 })
    ]));
  });
});
