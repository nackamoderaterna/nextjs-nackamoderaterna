import { Metadata } from "next";

interface GenerateMetadataParams {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
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
  const imageUrl = image ? (image.startsWith("http") ? image : `${siteUrl}${image}`) : undefined;

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
