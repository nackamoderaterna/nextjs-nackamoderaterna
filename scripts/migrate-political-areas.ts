/**
 * Migration script to convert politicalAreas from array of references
 * to array of objects with { politicalArea: reference, showOnPoliticalAreaPage: boolean }
 * 
 * Usage:
 *   npx tsx scripts/migrate-political-areas.ts
 * 
 * Or with ts-node:
 *   ts-node scripts/migrate-political-areas.ts
 * 
 * Make sure to set SANITY_API_TOKEN environment variable with write access
 */

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error("Error: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID environment variable is required");
  process.exit(1);
}

if (!token) {
  console.error("Error: SANITY_API_TOKEN environment variable is required");
  console.error("You can create a token at: https://www.sanity.io/manage");
  process.exit(1);
}

// Create a write client (migrations need write access)
const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false, // Don't use CDN for migrations
  token,
});

/**
 * Check if a politicalAreas array uses the old structure (array of references)
 */
function isOldStructure(politicalAreas: any): boolean {
  if (!Array.isArray(politicalAreas) || politicalAreas.length === 0) {
    return false;
  }
  
  // Old structure: array of references (objects with _ref, _type, _key)
  // New structure: array of objects with { politicalArea: {...}, showOnPoliticalAreaPage: boolean }
  const firstItem = politicalAreas[0];
  
  // If it has _ref directly, it's the old structure
  if (firstItem && firstItem._ref && !firstItem.politicalArea) {
    return true;
  }
  
  return false;
}

/**
 * Convert old structure to new structure
 */
function convertToNewStructure(oldPoliticalAreas: any[]): any[] {
  return oldPoliticalAreas.map((item) => {
    // If it's already the new structure, return as is
    if (item.politicalArea) {
      return item;
    }
    
    // Convert old structure (reference) to new structure (object with reference)
    const newItem: any = {
      _type: "politicalAreaReference",
      politicalArea: {
        _type: "reference",
        _ref: item._ref,
      },
      showOnPoliticalAreaPage: false, // Default to false as per your schema change
    };
    
    // Preserve _key if it exists (helps with Sanity's internal tracking)
    if (item._key) {
      newItem._key = item._key;
    }
    
    return newItem;
  });
}

async function migratePoliticalAreas() {
  console.log("Starting migration of politicalAreas...");
  console.log(`Project: ${projectId}, Dataset: ${dataset}\n`);

  try {
    // Fetch all politicians
    const politicians = await client.fetch(
      `*[_type == "politician" && defined(politicalAreas) && count(politicalAreas) > 0] {
        _id,
        _rev,
        name,
        politicalAreas
      }`
    );

    console.log(`Found ${politicians.length} politicians with politicalAreas\n`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const politician of politicians) {
      try {
        // Check if migration is needed
        if (!isOldStructure(politician.politicalAreas)) {
          console.log(`✓ Skipping ${politician.name || politician._id} - already using new structure`);
          skipped++;
          continue;
        }

        // Convert to new structure
        const newPoliticalAreas = convertToNewStructure(politician.politicalAreas);

        // Update the document
        await client
          .patch(politician._id)
          .set({ politicalAreas: newPoliticalAreas })
          .commit();

        console.log(`✓ Migrated ${politician.name || politician._id} (${politician.politicalAreas.length} areas)`);
        migrated++;
      } catch (error) {
        console.error(`✗ Error migrating ${politician.name || politician._id}:`, error);
        errors++;
      }
    }

    console.log("\n=== Migration Summary ===");
    console.log(`Total politicians checked: ${politicians.length}`);
    console.log(`Migrated: ${migrated}`);
    console.log(`Skipped (already migrated): ${skipped}`);
    console.log(`Errors: ${errors}`);
    
    if (errors === 0) {
      console.log("\n✅ Migration completed successfully!");
    } else {
      console.log("\n⚠️  Migration completed with errors. Please review the output above.");
    }
  } catch (error) {
    console.error("Fatal error during migration:", error);
    process.exit(1);
  }
}

// Run the migration
migratePoliticalAreas();
