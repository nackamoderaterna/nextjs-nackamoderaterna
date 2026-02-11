/**
 * Migration script to:
 * 1. Create eventType documents (meeting, conference, campaign, other)
 * 2. Convert event.eventType from string to reference
 *
 * Usage:
 *   npx tsx scripts/migrate-event-types.ts
 *
 * Make sure to set SANITY_API_TOKEN environment variable with write access
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
    "Error: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID environment variable is required"
  );
  process.exit(1);
}

if (!token) {
  console.error(
    "Error: SANITY_API_TOKEN environment variable is required"
  );
  console.error(
    "You can create a token at: https://www.sanity.io/manage"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

const EVENT_TYPE_MAP: Record<string, { name: string; slug: string }> = {
  meeting: { name: "Möte", slug: "mote" },
  conference: { name: "Konferens", slug: "konferens" },
  campaign: { name: "Kampanj", slug: "kampanj" },
  other: { name: "Övrigt", slug: "ovrigt" },
};

async function createEventTypeDocuments() {
  console.log("Creating eventType documents...\n");

  for (const [key, { name, slug }] of Object.entries(EVENT_TYPE_MAP)) {
    const id = `eventType-${key}`;
    await client.createIfNotExists({
      _id: id,
      _type: "eventType",
      name,
      slug: { _type: "slug", current: slug },
    });
    console.log(`  ✓ ${id} → "${name}" (slug: ${slug})`);
  }

  console.log("");
}

/**
 * Check if the eventType field is still the old string format
 */
function isOldStringValue(eventType: unknown): eventType is string {
  return typeof eventType === "string";
}

async function migrateEvents() {
  console.log("Migrating event documents...\n");

  const events = await client.fetch(
    `*[_type == "event" && defined(eventType)] { _id, title, eventType }`
  );

  console.log(`Found ${events.length} events with eventType\n`);

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const event of events) {
    try {
      if (!isOldStringValue(event.eventType)) {
        console.log(
          `  ✓ Skipping "${event.title || event._id}" - already a reference`
        );
        skipped++;
        continue;
      }

      const oldValue = event.eventType;
      const mapping = EVENT_TYPE_MAP[oldValue];

      if (!mapping) {
        console.log(
          `  ✗ Unknown eventType "${oldValue}" on "${event.title || event._id}" - skipping`
        );
        errors++;
        continue;
      }

      const refId = `eventType-${oldValue}`;

      await client
        .patch(event._id)
        .set({
          eventType: {
            _type: "reference",
            _ref: refId,
          },
        })
        .commit();

      console.log(
        `  ✓ Migrated "${event.title || event._id}" → ${refId}`
      );
      migrated++;
    } catch (error) {
      console.error(
        `  ✗ Error migrating "${event.title || event._id}":`,
        error
      );
      errors++;
    }
  }

  return { total: events.length, migrated, skipped, errors };
}

async function main() {
  console.log("=== Event Type Migration ===");
  console.log(`Project: ${projectId}, Dataset: ${dataset}\n`);

  await createEventTypeDocuments();
  const { total, migrated, skipped, errors } = await migrateEvents();

  console.log("\n=== Migration Summary ===");
  console.log(`Total events checked: ${total}`);
  console.log(`Migrated: ${migrated}`);
  console.log(`Skipped (already migrated): ${skipped}`);
  console.log(`Errors: ${errors}`);

  if (errors === 0) {
    console.log("\n✅ Migration completed successfully!");
  } else {
    console.log(
      "\n⚠️  Migration completed with errors. Please review the output above."
    );
  }
}

main();
