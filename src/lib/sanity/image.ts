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
  if (!image) return "";
  const builder = imageUrlBuilder(sanityClient);

  let url = builder
    .image(image)
    .auto("format")
    .fit(options?.fit || "max"); // ✅ NOT crop

  if (options?.width) url = url.width(options.width);
  if (options?.height) url = url.height(options.height);
  if (options?.quality) url = url.quality(options.quality);

  return url.url();
}
