import { createClient } from "next-sanity";

const isDevelopment = process.env.NODE_ENV === "development";
const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "/studio";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  // Disable CDN in development for immediate updates, enable in production for performance
  useCdn: !isDevelopment,
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
