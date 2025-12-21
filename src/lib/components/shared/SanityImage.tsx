import { buildImageUrl } from "@/lib/sanity/image";
import { getObjectPositionFromHotspot } from "@/lib/sanity/imageHotspot";
import Image from "next/image";
import React from "react";

type SanityImageProps = {
  image: any;
  alt?: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export function SanityImage({
  image,
  alt = "",
  width = 1200,
  height,
  sizes = "(max-width: 768px) 100vw, 1200px",
  className = "",
  priority = false,
}: SanityImageProps) {
  const imageUrl = buildImageUrl(image, {
    width,
    height,
    quality: 80,
  });

  const objectPosition = getObjectPositionFromHotspot(image);

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height || 700}
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
      style={{ objectPosition }}
    />
  );
}
