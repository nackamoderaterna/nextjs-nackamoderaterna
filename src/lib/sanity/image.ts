import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { sanityClient } from "./client";
import imageUrlBuilder from "@sanity/image-url";

export function buildImageUrl(
  image: SanityImageSource,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    fit?: "max" | "scale" | "min";
  },
) {
  if (!image || !(image as { asset?: unknown }).asset) return "";
  const builder = imageUrlBuilder(sanityClient);

  let url = builder
    .image(image)
    .auto("format")
    .fit(options?.fit || "max");

  if (options?.width) url = url.width(options.width);
  if (options?.height) url = url.height(options.height);
  if (options?.quality) url = url.quality(options.quality);

  return url.url();
}

/**
 * Returns the original Sanity asset URL with a `?dl=` parameter so the
 * browser triggers a file download with a proper filename. No format
 * conversion or resizing is applied — the user gets the original file.
 */
export function buildOriginalImageUrl(
  image: SanityImageSource,
  filename?: string,
) {
  if (!image) return "";
  const builder = imageUrlBuilder(sanityClient);
  const url = builder.image(image).url();
  if (!url) return "";
  const dl = filename || url.split("/").pop()?.split("?")[0] || "image";
  return `${url}?dl=${encodeURIComponent(dl)}`;
}
