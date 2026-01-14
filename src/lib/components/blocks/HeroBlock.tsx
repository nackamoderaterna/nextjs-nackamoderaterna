import { buildImageUrl } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";
import Block from "./Block";
import { BlockHero } from "~/sanity.types";
import { SanityBackgroundImage } from "../shared/SanityBackgroundImage";

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

  return (
    <div className={`relative w-full ${height} overflow-hidden`}>
      <SanityBackgroundImage image={block.backgroundImage} />
      <div className={`relative ${height} flex items-center`}>
        <Block>
          <div className="z-90">
            {block.heading && (
              <h1 className=" text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
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
