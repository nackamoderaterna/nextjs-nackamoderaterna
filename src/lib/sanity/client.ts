import { createClient } from "next-sanity";

const isDevelopment = process.env.NODE_ENV === "development";
const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "/studio";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: true,
  perspective: "published",
  stega: isDevelopment
    ? {
        enabled: true,
        studioUrl,
      }
    : {
        enabled: false,
      },
});

// Revalidation time in seconds (5 minutes)
export const REVALIDATE_TIME = 300;
