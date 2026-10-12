import { fireEvent, render, screen } from "@testing-library/react";
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

  it("sorts descending by the selected statistic, then appearances", () => {
    render(<PlayerStatsSection statistics={[
      { playerName: "Goals leader", appearances: 4, goals: 4, assists: 0, season: "2026" },
      { playerName: "Assist leader", appearances: 5, goals: 1, assists: 5, season: "2026" },
      { playerName: "More appearances", appearances: 6, goals: 1, assists: 2, season: "2026" },
      { playerName: "Fewer appearances", appearances: 3, goals: 1, assists: 2, season: "2026" }
    ]} />);
    const rows = () => screen.getAllByRole("row").slice(1).map((row) => row.textContent);
    expect(rows()[0]).toContain("Goals leader");
    fireEvent.change(screen.getByLabelText("Order by"), { target: { value: "assists" } });
    expect(rows()[0]).toContain("Assist leader");
    expect(rows()[1]).toContain("More appearances");
    expect(rows()[2]).toContain("Fewer appearances");
  });
});
