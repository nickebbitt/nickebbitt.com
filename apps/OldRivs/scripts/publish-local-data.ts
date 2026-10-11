import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { publishLocalData } from "../src/lib/local-data-publisher.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
publishLocalData(resolve(root, "src/data/local-team-update.json"), resolve(root, "src/data"))
  .then(() => console.info("Published validated local team data."))
  .catch((error: unknown) => { console.error(`Local publication failed: ${error instanceof Error ? error.message : String(error)}`); process.exitCode = 1; });
