import { buildImageUrl } from "@/lib/sanity/image";
import { getObjectPositionFromHotspot } from "@/lib/sanity/imageHotspot";
import Image from "next/image";
import React from "react";

type SanityImageProps = {
  image: any;
  alt?: string;
  width?: number;
  height?: number;
  /** When fill=true, pass source dimensions to avoid loading full-size images. Improves LCP. */
  sourceWidth?: number;
  sourceHeight?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  loading?: "lazy" | "eager";
};

export function SanityImage({
  image,
  alt = "",
  width = 700,
  height,
  sourceWidth,
  sourceHeight,
  sizes = "(max-width: 768px) 100vw, 1200px",
  className = "",
  priority = false,
  fill = false,
  loading,
}: SanityImageProps) {
  if (!image) {
    return null;
  }

  const imageUrl = buildImageUrl(image, {
    width: fill ? (sourceWidth ?? 1200) : width,
    height: fill ? sourceHeight : height,
    quality: 85,
  });

  if (!imageUrl) {
    return null;
  }

  const objectPosition = getObjectPositionFromHotspot(image);
  const imageAlt = alt || image.alt || "";
    // Determine object-fit class: use className if it contains object-*, otherwise default to object-cover
  const objectFitClass = className.includes("object-")
    ? className
    : `object-cover ${className}`;

  return fill ? (
    <Image
      src={imageUrl}
      alt={imageAlt}
      fill
      sizes={sizes}
      priority={priority}
      loading={loading}
      className={objectFitClass}
      style={{ objectPosition }}
    />
  ) : (
    <Image
      src={imageUrl}
      alt={imageAlt}
      height={height || 500}
      width={width || 700}
      sizes={sizes}
      priority={priority}
      loading={loading}
      className={objectFitClass}
      style={{ objectPosition }}
    />
  );
}
