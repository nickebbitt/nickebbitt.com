import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MatchesSection } from "../../../src/components/matches/matches-section";

describe("MatchesSection", () => {
  it("shows a confirmed result immediately on its match day", () => {
    render(
      <MatchesSection
        fixtures={[]}
        results={[
          {
            id: "hindley",
            completedAt: "2099-10-17",
            opponent: "Hindley Town U13 Barbarians",
            homeAway: "home",
            status: "confirmed",
            teamScore: 4,
            opponentScore: 1
          }
        ]}
      />
    );

    expect(screen.getByText("Hindley Town U13 Barbarians")).toBeInTheDocument();
    expect(screen.getByText("Result: 4 - 1")).toBeInTheDocument();
  });
});
