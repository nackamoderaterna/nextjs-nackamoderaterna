/**
 * Migration script to convert politicalIssue.politicalAreas entries
 * from plain references to objects with { area, display }.
 *
 * Before: { _type: "reference", _ref: "area-id", _key: "abc" }
 * After:  { _key: "abc", area: { _type: "reference", _ref: "area-id" }, display: false }
 *
 * ~20% of entries get display: true so category pages aren't empty.
 *
 * Usage:
 *   npx tsx --env-file=.env scripts/migrate-political-area-display.ts
 *
 * Make sure to set SANITY_API_TOKEN environment variable with write access.
 */

import { createClient } from "@sanity/client";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "0vagy5jk";
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error(
    "Error: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID environment variable is required",
  );
  process.exit(1);
}

if (!token) {
  console.error("Error: SANITY_API_TOKEN environment variable is required");
  console.error("You can create a token at: https://www.sanity.io/manage");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

interface OldEntry {
  _type: "reference";
  _ref: string;
  _key: string;
}

interface NewEntry {
  _key: string;
  area: { _type: "reference"; _ref: string };
  display: boolean;
}

function isOldFormat(entry: unknown): entry is OldEntry {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "_type" in entry &&
    (entry as OldEntry)._type === "reference" &&
    "_ref" in entry
  );
}

function isNewFormat(entry: unknown): entry is NewEntry {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "area" in entry &&
    "display" in entry
  );
}

async function migrate() {
  console.log("=== Political Area Display Migration ===");
  console.log(`Project: ${projectId}, Dataset: ${dataset}\n`);

  const issues = await client.fetch<
    Array<{ _id: string; question?: string; politicalAreas: unknown[] }>
  >(
    `*[_type == "politicalIssue" && defined(politicalAreas)] { _id, question, politicalAreas }`,
  );

  console.log(`Found ${issues.length} political issues with politicalAreas\n`);

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const issue of issues) {
    try {
      const areas = issue.politicalAreas;

      // Check if already migrated (all entries are new format)
      if (areas.every((entry) => isNewFormat(entry))) {
        console.log(
          `  - Skipping "${issue.question || issue._id}" — already migrated`,
        );
        skipped++;
        continue;
      }

      const newAreas: NewEntry[] = areas.map((entry) => {
        if (isNewFormat(entry)) {
          return entry;
        }

        if (!isOldFormat(entry)) {
          throw new Error(
            `Unexpected entry format in "${issue._id}": ${JSON.stringify(entry)}`,
          );
        }

        return {
          _key: entry._key,
          area: { _type: "reference" as const, _ref: entry._ref },
          display: Math.random() < 0.2,
        };
      });

      await client.patch(issue._id).set({ politicalAreas: newAreas }).commit();

      const displayCount = newAreas.filter((a) => a.display).length;
      console.log(
        `  ✓ Migrated "${issue.question || issue._id}" — ${newAreas.length} areas (${displayCount} displayed)`,
      );
      migrated++;
    } catch (error) {
      console.error(
        `  ✗ Error migrating "${issue.question || issue._id}":`,
        error,
      );
      errors++;
    }
  }

  console.log("\n=== Migration Summary ===");
  console.log(`Total issues checked: ${issues.length}`);
  console.log(`Migrated: ${migrated}`);
  console.log(`Skipped (already migrated): ${skipped}`);
  console.log(`Errors: ${errors}`);

  if (errors === 0) {
    console.log("\n✅ Migration completed successfully!");
  } else {
    console.log(
      "\n⚠️  Migration completed with errors. Please review the output above.",
    );
  }
}

migrate();
