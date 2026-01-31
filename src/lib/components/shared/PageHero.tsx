import Link from "next/link";
import Block from "../blocks/Block";
import { SanityBackgroundImage } from "./SanityBackgroundImage";
import { Button } from "@/components/ui/button";

const heightClasses = {
  small: "h-[400px]",
  medium: "h-[600px]",
  large: "h-[800px]",
  fullscreen: "h-[calc(100vh-var(--header-height))]",
};

export type PageHeroData = {
  heading?: string | null;
  subheading?: string | null;
  backgroundImage?: unknown;
  overlayOpacity?: number | null;
  ctaButton?: {
    label?: string | null;
    link?: string | null;
  } | null;
  height?: string | null;
};

interface PageHeroProps {
  hero: PageHeroData;
}

export function PageHero({ hero }: PageHeroProps) {
  const height =
    heightClasses[(hero.height as keyof typeof heightClasses) || "medium"] ||
    heightClasses.medium;

  return (
    <div className={`relative w-full ${height} overflow-hidden`}>
      <div className="absolute inset-0">
        <SanityBackgroundImage
          image={hero.backgroundImage}
          overlayOpacity={hero.overlayOpacity ?? 40}
          loading="eager"
          priority
        />
      </div>
      <div className={`relative ${height} flex items-center`}>
        <Block
          paddingX="standard"
          paddingY="none"
          asSection={false}
          className="w-full"
        >
          <div className="z-10">
            {hero.heading && (
              <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl mb-4">
                {hero.heading}
              </h1>
            )}
            {hero.subheading && (
              <p className="mb-8 text-xl text-white opacity-90 md:text-2xl">
                {hero.subheading}
              </p>
            )}
            {hero.ctaButton?.label && hero.ctaButton?.link && (
              <Button variant="secondary" asChild>
                <Link href={hero.ctaButton.link}>{hero.ctaButton.label}</Link>
              </Button>
            )}
          </div>
        </Block>
      </div>
    </div>
  );
}
