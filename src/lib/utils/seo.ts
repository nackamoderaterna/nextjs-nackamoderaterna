import { Metadata } from "next";
import { sanityClient } from "@/lib/sanity/client";
import { buildImageUrl } from "@/lib/sanity/image";
import { groq } from "next-sanity";

interface GenerateMetadataParams {
  title: string;
  description?: string;
  image?: string | null;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

/** Fetches globalSettings logo and returns OG image URL, or undefined if no logo. */
export async function getDefaultOgImage(): Promise<string | undefined> {
  const settings = await sanityClient.fetch<{ logo?: unknown } | null>(
    groq`*[_type == "globalSettings"][0] { logo }`,
    {},
    { next: { revalidate: 86400 } }
  );
  if (!settings?.logo) return undefined;
  return buildImageUrl(settings.logo, { width: 1200, height: 630 });
}

export function generateMetadata({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
}: GenerateMetadataParams): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nackamoderaterna.se";
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const imageUrl = image
    ? (image.startsWith("http") ? image : `${siteUrl}${image}`)
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Nackamoderaterna",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}
