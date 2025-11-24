import type { BlockHero } from "../../../../sanity.types";
import { buildImageUrl } from "@/lib/sanity/image";
import { CONTAINER_MAX_WIDTH } from "@/lib/utils/layout";
import Link from "next/link";

const heightClasses = {
  small: "h-[400px]",
  medium: "h-[600px]",
  large: "h-[800px]",
  fullscreen: "h-[calc(100vh-var(--header-height))]",
};

const alignmentClasses = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

const textColorClasses = {
  light: "text-white",
  dark: "text-gray-900",
};

interface HeroBlockProps {
  block: BlockHero;
}

export function HeroBlock({ block }: HeroBlockProps) {
  const height =
    heightClasses[block.height as keyof typeof heightClasses] ||
    heightClasses.medium;
  const alignment =
    alignmentClasses[block.alignment as keyof typeof alignmentClasses] ||
    alignmentClasses.center;
  const textColor =
    textColorClasses[block.textColor as keyof typeof textColorClasses] ||
    textColorClasses.light;

  // Build responsive image URL with hotspot
  const imageUrl = buildImageUrl(block.backgroundImage, {
    width: 1920,
    quality: 80,
  });

  const overlayOpacity = (block.overlayOpacity || 40) / 100;

  const objectPosition = block.backgroundImage?.hotspot
    ? `${block.backgroundImage.hotspot.x! * 100}% ${block.backgroundImage.hotspot.y! * 100}%`
    : "center";
  return (
    <div className={`relative w-full ${height} overflow-hidden`}>
      {/* Background Image with Hotspot */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={block.heading || ""}
          className="w-full h-full object-cover"
          style={{
            objectPosition,
          }}
        />
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div
        className={`relative h-full flex flex-col justify-center ${alignment}`}
      >
        <div className={`${CONTAINER_MAX_WIDTH} mx-auto px-4 w-full`}>
          <div className="max-w-4xl">
            {block.heading && (
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${textColor}`}
              >
                {block.heading}
              </h1>
            )}

            {block.subheading && (
              <p className={`text-xl md:text-2xl mb-8 ${textColor} opacity-90`}>
                {block.subheading}
              </p>
            )}

            {block.ctaButton?.label && block.ctaButton?.link && (
              <Link
                href={block.ctaButton.link}
                className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {block.ctaButton.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
