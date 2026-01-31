/**
 * Migration script: move politician social media from old field (socialMedia)
 * to the new shared field (socialLinks). The data shape is the same
 * (facebook, twitter, instagram, linkedin, tiktok); only the field name and type changed.
 *
 * Usage:
 *   SANITY_API_TOKEN="your-token" npx tsx scripts/migrate-politician-social-links.ts
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

type SocialMediaOld = {
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  tiktok?: string | null;
};

function hasAnyLink(social: SocialMediaOld | null | undefined): boolean {
  if (!social || typeof social !== "object") return false;
  const urls = [
    social.facebook,
    social.twitter,
    social.instagram,
    social.linkedin,
    social.tiktok,
  ];
  return urls.some(
    (u) => typeof u === "string" && u.trim() !== ""
  );
}

async function main() {
  console.log("Migrating politician socialMedia → socialLinks...");
  console.log(`Project: ${projectId}, Dataset: ${dataset}\n`);

  // Politicians that have the old socialMedia field (with at least one URL)
  // and do not yet have socialLinks (or we overwrite if they have both)
  const withOldSocial = await client.fetch<
    Array<{
      _id: string;
      name?: string | null;
      socialMedia?: SocialMediaOld | null;
      socialLinks?: SocialMediaOld | null;
    }>
  >(
    `*[_type == "politician" && defined(socialMedia) && socialMedia != null] | order(name asc) {
      _id,
      name,
      socialMedia,
      socialLinks
    }`
  );

  const toMigrate = withOldSocial.filter((doc) => hasAnyLink(doc.socialMedia));
  const totalPoliticians = await client.fetch<number>(
    `count(*[_type == "politician"])`
  );

  console.log(`Total politicians: ${totalPoliticians}`);
  console.log(`With old socialMedia field: ${withOldSocial.length}`);
  console.log(`To migrate (socialMedia has at least one URL): ${toMigrate.length}\n`);

  if (toMigrate.length === 0) {
    console.log("✅ No politicians to migrate. Nothing to do.");
    return;
  }

  let migrated = 0;
  let errors = 0;

  for (const doc of toMigrate) {
    try {
      const socialMedia = doc.socialMedia as SocialMediaOld;
      const socialLinks = {
        _type: "socialLinks",
        facebook: socialMedia?.facebook ?? undefined,
        twitter: socialMedia?.twitter ?? undefined,
        instagram: socialMedia?.instagram ?? undefined,
        linkedin: socialMedia?.linkedin ?? undefined,
        tiktok: socialMedia?.tiktok ?? undefined,
      };

      await client
        .patch(doc._id)
        .set({ socialLinks })
        .unset(["socialMedia"])
        .commit();

      const name = doc.name || doc._id;
      const links = [
        socialLinks.facebook && "Facebook",
        socialLinks.twitter && "Twitter",
        socialLinks.instagram && "Instagram",
        socialLinks.linkedin && "LinkedIn",
        socialLinks.tiktok && "TikTok",
      ].filter(Boolean);
      console.log(`✓ Migrated: ${name} (${links.join(", ")})`);
      migrated++;
    } catch (e) {
      console.error(`✗ Error migrating ${doc.name || doc._id}:`, e);
      errors++;
    }
  }

  console.log("\n=== Migration Summary ===");
  console.log(`Migrated: ${migrated}`);
  console.log(`Skipped (no URLs in socialMedia): ${withOldSocial.length - toMigrate.length}`);
  console.log(`Errors: ${errors}`);
  if (errors === 0) {
    console.log("\n✅ Migration completed successfully!");
  } else {
    console.log("\n⚠️  Completed with errors.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
