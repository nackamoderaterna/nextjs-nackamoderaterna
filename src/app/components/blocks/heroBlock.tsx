import { buildImageUrl } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";
import { BlockHero } from "@/lib/sanity/sanity.types";
import Block from "./Block";

const heightClasses = {
  small: "h-[400px]",
  medium: "h-[600px]",
  large: "h-[800px]",
  fullscreen: "h-[calc(100vh-var(--header-height))]",
};

interface HeroBlockProps {
  block: BlockHero;
}

export function HeroBlock({ block }: HeroBlockProps) {
  const height =
    heightClasses[block.height as keyof typeof heightClasses] ||
    heightClasses.medium;

  // Build responsive image URL with hotspot
  const imageUrl = buildImageUrl(block.backgroundImage || "", {
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
        <Image
          src={imageUrl}
          alt={block.heading || ""}
          className="w-full h-full object-cover"
          sizes="100vw"
          height={1200}
          width={2000}
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

      {/* Content Container - Full height flex to center content */}
      <div className={`relative ${height} flex items-center`}>
        <Block settings={block.blockSettings} applyBackground={false}>
          <div className="z-20">
            {block.heading && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
                {block.heading}
              </h1>
            )}
            {block.subheading && (
              <p className="text-xl md:text-2xl mb-8 opacity-90 text-white">
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
        </Block>
      </div>
    </div>
  );
}
