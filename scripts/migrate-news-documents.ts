/**
 * Migration script: convert news documents[] from plain file array to
 * object array with { title, file } structure.
 *
 * Old:  documents[{ _type: "file", asset: { _ref } }]
 * New:  documents[{ title: "filename.pdf", file: { _type: "file", asset: { _ref } } }]
 *
 * Usage:
 *   SANITY_API_TOKEN="your-token" npx tsx --env-file=.env scripts/migrate-news-documents.ts
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
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

type OldDoc = {
  _id: string;
  title?: string;
  documents: Array<{
    _key: string;
    assetRef: string;
    originalFilename: string | null;
  }>;
};

async function main() {
  console.log("Migrating news documents[] to { title, file } structure...");
  console.log(`Project: ${projectId}, Dataset: ${dataset}\n`);

  // Fetch news that still have old-format documents (asset directly on item)
  const toMigrate = await client.fetch<OldDoc[]>(
    `*[_type == "news" && defined(documents) && count(documents[defined(asset)]) > 0] {
      _id,
      title,
      "documents": documents[defined(asset)] {
        _key,
        "assetRef": asset._ref,
        "originalFilename": asset->originalFilename
      }
    }`
  );

  console.log(`Found ${toMigrate.length} news articles to migrate.\n`);

  if (toMigrate.length === 0) {
    console.log("✅ All news documents already use the new structure.");
    return;
  }

  let migrated = 0;
  let errors = 0;

  for (const doc of toMigrate) {
    try {
      const newDocuments = doc.documents.map((item) => ({
        _key: item._key,
        title: item.originalFilename ?? "Dokument",
        file: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: item.assetRef,
          },
        },
      }));

      await client.patch(doc._id).set({ documents: newDocuments }).commit();

      console.log(
        `✓ Migrated: ${doc.title || doc._id} (${newDocuments.length} file${newDocuments.length !== 1 ? "r" : ""})`
      );
      migrated++;
    } catch (e) {
      console.error(`✗ Error migrating ${doc.title || doc._id}:`, e);
      errors++;
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Migrated: ${migrated}`);
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
