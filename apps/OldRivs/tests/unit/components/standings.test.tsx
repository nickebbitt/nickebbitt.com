import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StandingsSection } from "../../../src/components/standings/standings-section";

describe("StandingsSection", () => {
  it("highlights the Under 13s row with the required league fields", () => {
    const { container } = render(
      <StandingsSection
        standings={{
          status: "current",
          entries: [
            {
              position: 1,
              teamName: "Old Rivingtonians Under 13s",
              played: 8,
              won: 7,
              drawn: 0,
              lost: 1,
              points: 21,
              isUnder13s: true
            }
          ]
        }}
      />
    );

    expect(screen.getByText("Old Rivingtonians Under 13s")).toBeInTheDocument();
    expect(screen.getByText("21")).toBeInTheDocument();
    expect(container.querySelector(".team-row")).toHaveTextContent("Old Rivingtonians Under 13s");
  });

  it("explains when a current league table is unavailable", () => {
    render(
      <StandingsSection
        standings={{
          status: "unavailable",
          statusMessage: "A current league table has not been published.",
          entries: []
        }}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent("A current league table has not been published.");
  });
});
