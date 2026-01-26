/**
 * Migration script to clean invisible Unicode characters from politician names
 * 
 * This script removes invisible Unicode characters like:
 * - Zero-width spaces (\u200B)
 * - Zero-width non-joiners (\u200C)
 * - Zero-width joiners (\u200D)
 * - BOM markers (\uFEFF)
 * - Word joiners (\u2060)
 * - Other invisible formatting characters
 * 
 * Usage:
 *   npx tsx scripts/clean-politician-names.ts
 * 
 * Or with ts-node:
 *   ts-node scripts/clean-politician-names.ts
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
 * Removes invisible Unicode characters from a string.
 * This includes zero-width spaces, zero-width non-joiners, BOM markers, and other invisible characters.
 */
function cleanInvisibleUnicode(str: string | null | undefined): string {
  if (!str) return "";
  
  return str
    // Remove BOM (Byte Order Mark) and other zero-width characters
    .replace(/[\u200B-\u200D\uFEFF\u2060\u200C\u200D]/g, "")
    // Remove zero-width space
    .replace(/\u200B/g, "")
    // Remove zero-width non-joiner
    .replace(/\u200C/g, "")
    // Remove zero-width joiner
    .replace(/\u200D/g, "")
    // Remove word joiner
    .replace(/\u2060/g, "")
    // Remove BOM
    .replace(/\uFEFF/g, "")
    // Remove other invisible formatting characters
    .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "")
    // Trim whitespace
    .trim();
}

/**
 * Check if a name contains invisible Unicode characters
 */
function hasInvisibleChars(name: string | null | undefined): boolean {
  if (!name) return false;
  const cleaned = cleanInvisibleUnicode(name);
  return name !== cleaned;
}

async function cleanPoliticianNames() {
  console.log("Starting cleanup of invisible Unicode characters from politician names...");
  console.log(`Project: ${projectId}, Dataset: ${dataset}\n`);

  try {
    // Fetch all politicians
    const politicians = await client.fetch(
      `*[_type == "politician" && defined(name)] {
        _id,
        _rev,
        name
      }`
    );

    console.log(`Found ${politicians.length} politicians\n`);

    let cleaned = 0;
    let skipped = 0;
    let errors = 0;

    for (const politician of politicians) {
      try {
        const originalName = politician.name;
        
        // Check if cleaning is needed
        if (!hasInvisibleChars(originalName)) {
          skipped++;
          continue;
        }

        // Clean the name
        const cleanedName = cleanInvisibleUnicode(originalName);

        // Update the document
        await client
          .patch(politician._id)
          .set({ name: cleanedName })
          .commit();

        console.log(`✓ Cleaned: "${originalName}" → "${cleanedName}"`);
        cleaned++;
      } catch (error) {
        console.error(`✗ Error cleaning ${politician.name || politician._id}:`, error);
        errors++;
      }
    }

    console.log("\n=== Cleanup Summary ===");
    console.log(`Total politicians checked: ${politicians.length}`);
    console.log(`Cleaned: ${cleaned}`);
    console.log(`Skipped (no invisible chars): ${skipped}`);
    console.log(`Errors: ${errors}`);
    
    if (errors === 0) {
      console.log("\n✅ Cleanup completed successfully!");
    } else {
      console.log("\n⚠️  Cleanup completed with errors. Please review the output above.");
    }
  } catch (error) {
    console.error("Fatal error during cleanup:", error);
    process.exit(1);
  }
}

// Run the cleanup
cleanPoliticianNames();
