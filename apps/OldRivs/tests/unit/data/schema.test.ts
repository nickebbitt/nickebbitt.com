import { describe, expect, it } from "vitest";
import { snapshotSchema } from "../../../src/data/schema";

const validSnapshot = {
  team: { displayName: "Old Rivingtonians Under 13s", sourceTeamReference: "ORFC U13" },
  source: { sourceName: "Full-Time", sourceUrl: "https://fulltime.thefa.com/", status: "current" },
  fixtures: [{ id: "one", scheduledAt: "2026-10-04T10:00:00.000Z", opponent: "Rivals", homeAway: "home", status: "scheduled" }],
  results: [],
  standings: { status: "current", entries: [] }
};

describe("team hub data schema", () => {
  it("rejects duplicate fixture IDs", () => {
    expect(() => snapshotSchema.parse({ ...validSnapshot, fixtures: [...validSnapshot.fixtures, validSnapshot.fixtures[0]] })).toThrow();
  });
  it("requires a public-safe message for unavailable data", () => {
    expect(() => snapshotSchema.parse({ ...validSnapshot, source: { ...validSnapshot.source, status: "unavailable" } })).toThrow();
  });
});
