import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { publishLocalData } from "../src/lib/local-data-publisher.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(root, "src/data/local-team-update.json");

// "Last updated" is when the team data was last committed, not when the site was rebuilt.
// Uncommitted edits, or a checkout without Git history, fall back to now.
function dataUpdatedAt(): Date {
  try {
    const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
    if (git("status", "--porcelain", "--", sourcePath)) return new Date();
    const committedAt = git("log", "-1", "--format=%cI", "--", sourcePath);
    return committedAt ? new Date(committedAt) : new Date();
  } catch {
    return new Date();
  }
}

publishLocalData(sourcePath, resolve(root, "src/data"), dataUpdatedAt())
  .then(() => console.info("Published validated local team data."))
  .catch((error: unknown) => { console.error(`Local publication failed: ${error instanceof Error ? error.message : String(error)}`); process.exitCode = 1; });
