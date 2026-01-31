import { Metadata } from "next";
import { generateMetadata as generateBaseMetadata } from "./seo";
import { buildImageUrl } from "@/lib/sanity/image";
import type { PageData } from "@/lib/types/pages";

/**
 * Extracts a plain text description from page blocks for SEO fallback.
 * Looks for text content in the first text block.
 */
function extractDescriptionFromBlocks(blocks: any[] = []): string | undefined {
  // Look for first text block with content
  const textBlock = blocks.find(
    (block) => block._type === "block.text" && block.content
  );
  if (textBlock?.content) {
    // Extract plain text from PortableText blocks
    const extractText = (content: any[]): string => {
      return content
        .map((item) => {
          if (item._type === "block") {
            return item.children
              ?.map((child: any) => child.text || "")
              .join("") || "";
          }
          return "";
        })
        .join(" ")
        .trim();
    };
    const text = extractText(textBlock.content);
    if (text) {
      // Return first 160 characters for SEO description
      return text.length > 160 ? text.substring(0, 157) + "..." : text;
    }
  }

  return undefined;
}

/**
 * Generates metadata for a page with SEO fallbacks.
 * Uses SEO data from Sanity if available, otherwise falls back to page title
 * and extracted description from blocks.
 */
export function generatePageMetadata(
  page: PageData | null,
  defaultTitle?: string
): Metadata {
  if (!page) {
    return generateBaseMetadata({
      title: defaultTitle || "Sidan hittades inte",
      description: "Den begärda sidan kunde inte hittas",
    });
  }

  const slug = page.slug?.current || "";
  const url = slug ? `/${slug}` : "/";
  const pageTitle = page.title || "Sida";

  // Use SEO title if set, otherwise use page title with site suffix
  const seoTitle = page.seo?.title || `${pageTitle} | Nackamoderaterna`;

  // Use SEO description if set, otherwise page header description, otherwise extract from blocks
  const seoDescription =
    page.seo?.description ||
    page.pageHeader?.description ||
    extractDescriptionFromBlocks(page.blocks) ||
    `Läs mer om ${pageTitle} på Nackamoderaterna`;

  // Build image URL from SEO image or use undefined
  let imageUrl: string | undefined;
  if (page.seo?.image) {
    if (page.seo.image.url) {
      imageUrl = page.seo.image.url;
    } else if (page.seo.image.asset) {
      imageUrl = buildImageUrl(page.seo.image.asset, {
        width: 1200,
        height: 630,
      });
    }
  }

  return generateBaseMetadata({
    title: seoTitle,
    description: seoDescription,
    image: imageUrl,
    url,
    type: "website",
  });
}
