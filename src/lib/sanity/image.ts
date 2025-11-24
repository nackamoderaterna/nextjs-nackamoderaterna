import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Build image URL with hotspot support
export function buildImageUrl(
  image: any,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  },
) {
  if (!image) return "";

  let url = builder.image(image).fit("crop").auto("format");

  // Apply hotspot as focal point
  if (image.hotspot) {
    url = url.focalPoint(image.hotspot.x, image.hotspot.y);
  }
  // Apply dimensions
  if (options?.width) {
    url = url.width(options.width);
  }
  if (options?.height) {
    url = url.height(options.height);
  }
  if (options?.quality) {
    url = url.quality(options.quality);
  }

  return url.url();
}
