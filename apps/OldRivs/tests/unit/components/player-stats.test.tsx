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

  it("shows only the selected statistic group and sorts it descending", () => {
    render(<PlayerStatsSection statistics={[
      { playerName: "Goals leader", appearances: 4, goals: 4, assists: 0, season: "2026" },
      { playerName: "Assist leader", appearances: 5, goals: 1, assists: 5, season: "2026" },
      { playerName: "More appearances", appearances: 6, goals: 1, assists: 2, season: "2026" },
      { playerName: "Fewer appearances", appearances: 3, goals: 1, assists: 2, season: "2026" }
    ]} />);
    const rows = () => screen.getAllByRole("row").slice(1).map((row) => row.textContent);
    expect(rows()[0]).toContain("Goals leader");
    fireEvent.change(screen.getByLabelText("View"), { target: { value: "awards" } });
    expect(screen.queryByRole("columnheader", { name: "Goals" })).not.toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Coach's POTM/ })).toBeInTheDocument();
    expect(rows()[0]).toContain("More appearances");
    fireEvent.click(screen.getByRole("button", { name: "Appearances" }));
    expect(rows()[0]).toContain("More appearances");
    fireEvent.click(screen.getByRole("button", { name: /Appearances/ }));
    expect(rows()[0]).toContain("Fewer appearances");
  });
});
