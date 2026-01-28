"use client";

import { buildImageUrl } from "@/lib/sanity/image";
import { getObjectPositionFromHotspot } from "@/lib/sanity/imageHotspot";
import Image from "next/image";

type SanityBackgroundImageProps = {
  image: any;
  alt?: string;
  height?: string;
  loading?: "lazy" | "eager";
  overlayOpacity?: number;
  priority?: boolean;
};

export function SanityBackgroundImage({
  image,
  alt = "",
  height = "h-full",
  loading = "lazy",
  overlayOpacity = 40,
  priority = false,
}: SanityBackgroundImageProps) {
  const imageUrl = buildImageUrl(image, {
    // Don't hardcode a large width here; let Next request appropriate sizes via `loader`.
    quality: 80,
  });

  const sanityLoader: React.ComponentProps<typeof Image>["loader"] = ({
    width,
    quality,
  }) =>
    buildImageUrl(image, {
      width,
      quality: quality ?? 80,
    });

  const objectPosition = getObjectPositionFromHotspot(image);
  const overlayAlpha = overlayOpacity / 100;

  return (
    <div className={`relative w-full ${height} overflow-hidden`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          loader={sanityLoader}
          alt={alt}
          fill
          loading={loading}
          priority={priority}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition }}
        />
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayAlpha }}
      />
    </div>
  );
}
