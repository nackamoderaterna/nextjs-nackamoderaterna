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
  keywords?: string[];
}

export interface GlobalSeoDefaults {
  description?: string;
  image?: string;
}

/** Fetches globalSettings seo.image (with logo fallback) and seo.description. */
export async function getGlobalSeoDefaults(): Promise<GlobalSeoDefaults> {
  const settings = await sanityClient.fetch<{
    logo?: unknown;
    seo?: { description?: string; image?: { url?: string } };
  } | null>(
    groq`*[_type == "globalSettings"][0] { logo, seo{ description, image{ ..., "url": asset->url } } }`,
    {},
    { next: { revalidate: 86400 } }
  );

  if (!settings) return {};

  const description = settings.seo?.description || undefined;

  let image: string | undefined;
  if (settings.seo?.image?.url) {
    image = settings.seo.image.url;
  } else if (settings.seo?.image) {
    image = buildImageUrl(settings.seo.image, { width: 1200, height: 630 });
  } else if (settings.logo) {
    image = buildImageUrl(settings.logo, { width: 1200, height: 630 });
  }

  return { description, image };
}

/** Fetches globalSettings logo/seo image and returns OG image URL, or undefined if none. */
export async function getDefaultOgImage(): Promise<string | undefined> {
  const defaults = await getGlobalSeoDefaults();
  return defaults.image;
}

export function generateMetadata({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  keywords,
}: GenerateMetadataParams): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nackamoderaterna.se";
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const imageUrl = image
    ? (image.startsWith("http") ? image : `${siteUrl}${image}`)
    : undefined;

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
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
