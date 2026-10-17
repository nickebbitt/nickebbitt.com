import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MatchesSection } from "../../../src/components/matches/matches-section";

describe("MatchesSection", () => {
  it("shows a confirmed result immediately on its match day", () => {
    render(
      <MatchesSection
        fixtures={[
          {
            id: "next-fixture",
            scheduledAt: "2099-10-24T09:00:00.000Z",
            opponent: "Little Lever Sports Club Junior U13 Tigers",
            homeAway: "away",
            status: "scheduled"
          },
          {
            id: "later-fixture",
            scheduledAt: "2099-11-07T09:00:00.000Z",
            opponent: "Daisy Hill Junior U13 Pumas",
            homeAway: "home",
            status: "scheduled"
          }
        ]}
        results={[
          {
            id: "hindley",
            completedAt: "2099-10-17",
            opponent: "Hindley Town U13 Barbarians",
            homeAway: "home",
            status: "confirmed",
            teamScore: 4,
            opponentScore: 1,
            goalContributions: [
              {
                scorer: "Kaydon",
                assist: "Hamish"
              }
            ]
          }
        ]}
      />
    );

    expect(screen.getByText("Hindley Town U13 Barbarians")).toBeInTheDocument();
    expect(screen.getByText("Result: 4 - 1")).toBeInTheDocument();
    expect(screen.getByText("Little Lever Sports Club Junior U13 Tigers")).toBeInTheDocument();
    expect(screen.queryByText("Daisy Hill Junior U13 Pumas")).not.toBeInTheDocument();
    expect(screen.queryByText("Kaydon (Hamish)")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Show match details for Hindley Town U13 Barbarians" }));

    expect(screen.getByText("Kaydon (Hamish)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hide match details for Hindley Town U13 Barbarians" })).toHaveAttribute("aria-expanded", "true");
  });
});
