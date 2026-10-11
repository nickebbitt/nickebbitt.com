import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlayerStatsSection } from "../../../src/components/player-stats/player-stats-section";

describe("PlayerStatsSection", () => {
  it("keeps tied players visible", () => {
    render(<PlayerStatsSection statistics={[
      { playerName: "Ava", appearances: 5, goals: 3, assists: 1, season: "2026" },
      { playerName: "Bea", appearances: 5, goals: 3, assists: 1, season: "2026" }
    ]} />);
    expect(screen.getByText("Ava")).toBeInTheDocument();
    expect(screen.getByText("Bea")).toBeInTheDocument();
  });
});
