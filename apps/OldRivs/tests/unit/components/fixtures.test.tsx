import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FixturesSection } from "../../../src/components/fixtures/fixtures-section";

describe("FixturesSection", () => {
  it("shows all upcoming scheduled fixtures in date order", () => {
    render(
      <FixturesSection
        fixtures={[
          {
            id: "later-fixture",
            scheduledAt: "2099-11-07T09:00:00.000Z",
            opponent: "Daisy Hill Junior U13 Pumas",
            homeAway: "home",
            status: "scheduled"
          },
          {
            id: "next-fixture",
            scheduledAt: "2099-10-24T09:00:00.000Z",
            opponent: "Little Lever Sports Club Junior U13 Tigers",
            homeAway: "away",
            status: "scheduled"
          }
        ]}
      />
    );

    expect(screen.getByLabelText("Fixtures")).toHaveTextContent(/Little Lever Sports Club Junior U13 Tigers.*Daisy Hill Junior U13 Pumas/);
  });
});
