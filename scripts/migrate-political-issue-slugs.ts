/**
 * Migration script to add slugs to political issues that don't have one.
 * Generates slugs from the question field using a slugify function.
 *
 * Usage:
 *   npx tsx scripts/migrate-political-issue-slugs.ts
 *
 * Make sure to set SANITY_API_TOKEN environment variable with write access
 */

import { createClient } from "@sanity/client";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID;
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

/**
 * Slugify text for URL-friendly identifier.
 * Matches Sanity's slug behavior: lowercase, replace spaces with hyphens,
 * remove/replace special characters.
 */
function slugify(text: string, maxLength = 96): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, maxLength);
}

/**
 * Ensure slug is unique by appending a suffix if needed
 */
async function getUniqueSlug(
  baseSlug: string,
  excludeId: string
): Promise<string> {
  const existing = await client.fetch<
    { _id: string }[]
  >(
    `*[_type == "politicalIssue" && slug.current == $slug && _id != $excludeId]{ _id }`,
    { slug: baseSlug, excludeId }
  );

  if (existing.length === 0) {
    return baseSlug;
  }

  let counter = 1;
  let candidate = `${baseSlug}-${counter}`;
  while (true) {
    const dup = await client.fetch<
      { _id: string }[]
    >(
      `*[_type == "politicalIssue" && slug.current == $slug]{ _id }`,
      { slug: candidate }
    );
    if (dup.length === 0) {
      return candidate;
    }
    counter++;
    candidate = `${baseSlug}-${counter}`;
  }
}

async function migratePoliticalIssueSlugs() {
  console.log("Starting migration of political issue slugs...");
  console.log(`Project: ${projectId}, Dataset: ${dataset}\n`);

  try {
    const issues = await client.fetch<
      { _id: string; question: string | null; slug?: { current?: string } | null }[]
    >(
      `*[_type == "politicalIssue" && (!defined(slug) || !defined(slug.current))] {
        _id,
        question,
        slug
      }`
    );

    console.log(`Found ${issues.length} political issues without slugs\n`);

    let migrated = 0;
    let errors = 0;

    for (const issue of issues) {
      try {
        const question = issue.question || "sakfrage";
        const baseSlug = slugify(question);

        if (!baseSlug) {
          console.log(
            `⚠ Skipping ${issue._id} - could not generate slug from "${question}"`
          );
          continue;
        }

        const slug = await getUniqueSlug(baseSlug, issue._id);

        await client
          .patch(issue._id)
          .set({
            slug: {
              _type: "slug",
              current: slug,
            },
          })
          .commit();

        console.log(`✓ Migrated "${question.substring(0, 50)}..." -> ${slug}`);
        migrated++;
      } catch (error) {
        console.error(`✗ Error migrating ${issue._id}:`, error);
        errors++;
      }
    }

    console.log("\n=== Migration Summary ===");
    console.log(`Total issues without slug: ${issues.length}`);
    console.log(`Migrated: ${migrated}`);
    console.log(`Errors: ${errors}`);

    if (errors === 0) {
      console.log("\n✅ Migration completed successfully!");
    } else {
      console.log(
        "\n⚠️  Migration completed with errors. Please review the output above."
      );
    }
  } catch (error) {
    console.error("Fatal error during migration:", error);
    process.exit(1);
  }
}

migratePoliticalIssueSlugs();
