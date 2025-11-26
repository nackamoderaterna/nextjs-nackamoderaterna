import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Build image URL with hotspot support
export function buildImageUrl(
  image: SanityImageSource,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    fit?: "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
  },
) {
  if (!image) return "";

  let url = builder
    .image(image)
    .auto("format")
    .fit(options?.fit || "crop");

  // Hotspot is automatically applied when using .crop('focalpoint')
  // OR when the image has hotspot data and you use fit('crop')
  if (
    image &&
    typeof image === "object" &&
    "hotspot" in image &&
    image.hotspot
  ) {
    url = url.focalPoint(image.hotspot.x, image.hotspot.y);
  }

  if (options?.width) url = url.width(options.width);
  if (options?.height) url = url.height(options.height);
  if (options?.quality) url = url.quality(options.quality);

  return url.url();
}
