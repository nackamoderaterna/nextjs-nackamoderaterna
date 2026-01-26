/**
 * Migration script: set variant to "default" for all news documents
 * that have no variant value set.
 *
 * Usage:
 *   SANITY_API_TOKEN="your-token" npx tsx scripts/set-news-variant-default.ts
 *
 * Prerequisites:
 *   - SANITY_API_TOKEN with write access
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID (or SANITY_PROJECT_ID)
 *   - NEXT_PUBLIC_SANITY_DATASET (or SANITY_DATASET, default: production)
 */

import { createClient } from "@sanity/client";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error(
    "Error: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID is required"
  );
  process.exit(1);
}

if (!token) {
  console.error("Error: SANITY_API_TOKEN is required (write access)");
  console.error("Create a token at: https://www.sanity.io/manage");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

async function main() {
  console.log("Setting variant to 'default' for news without a value...");
  console.log(`Project: ${projectId}, Dataset: ${dataset}\n`);

  const toUpdate = await client.fetch<
    Array<{ _id: string; title?: string; variant?: string | null }>
  >(
    `*[_type == "news" && (!defined(variant) || variant == null || !(variant in ["default", "debate", "pressrelease"]))] { _id, title, variant }`
  );

  const total = await client.fetch<number>(`count(*[_type == "news"])`);
  console.log(`Total news: ${total}`);
  console.log(`To update (no/invalid variant): ${toUpdate.length}\n`);

  if (toUpdate.length === 0) {
    console.log("✅ All news already have a valid variant. Nothing to do.");
    return;
  }

  let updated = 0;
  let errors = 0;

  for (const doc of toUpdate) {
    try {
      await client
        .patch(doc._id)
        .set({ variant: "default" })
        .commit();
      console.log(`✓ Updated: ${doc.title || doc._id}`);
      updated++;
    } catch (e) {
      console.error(`✗ Error updating ${doc.title || doc._id}:`, e);
      errors++;
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Updated: ${updated}`);
  console.log(`Errors: ${errors}`);
  if (errors === 0) {
    console.log("\n✅ Done.");
  } else {
    console.log("\n⚠️  Completed with errors.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
