import Link from "next/link";

import Block from "../blocks/Block";
import { Button } from "@/lib/components/ui/button";
import { SanityBackgroundImage } from "./SanityBackgroundImage";
import type { PageHeaderData } from "@/lib/types/pages";

const IMAGE_HEIGHT_CLASSES = {
  small: "h-[400px]",
  medium: "h-[600px]",
  large: "h-[800px]",
  fullscreen: "h-screen",
} as const;

type ImageHeightKey = keyof typeof IMAGE_HEIGHT_CLASSES;

export type { PageHeaderData };

interface PageHeaderProps {
  /** Page title – used for display when pageHeader.header is not set, and for slug generation. */
  title?: string;
  pageHeader?: PageHeaderData | null;
}

export function PageHeader({ title, pageHeader }: PageHeaderProps) {
  const displayTitle = (pageHeader?.header?.trim() || title) ?? undefined;
  const description =
    typeof pageHeader?.description === "string"
      ? pageHeader.description
      : undefined;
  const headerImage = pageHeader?.image;
  const overlayOpacity = pageHeader?.overlayOpacity ?? 40;
  const imageHeight =
    pageHeader?.imageHeight && pageHeader.imageHeight in IMAGE_HEIGHT_CLASSES
      ? (pageHeader.imageHeight as ImageHeightKey)
      : "medium";
  const heightClass = IMAGE_HEIGHT_CLASSES[imageHeight];
  const ctaButton = pageHeader?.ctaButton;
  const hasImage = headerImage != null;

  if (hasImage) {
    return (
      <div className={`relative w-full ${heightClass} overflow-hidden`}>
        <div className="absolute inset-0">
          <SanityBackgroundImage
            image={headerImage}
            overlayOpacity={overlayOpacity}
            loading="eager"
            priority
          />
        </div>
        <div className={`relative ${heightClass} flex items-center`}>
          <Block
            paddingX="standard"
            paddingY="none"
            asSection={false}
            className="w-full"
          >
            <div className="z-10">
              {displayTitle && (
                <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                  {displayTitle}
                </h1>
              )}
              {description && (
                <p className="max-w-2xl text-xl text-white opacity-90 md:text-2xl">
                  {description}
                </p>
              )}
              {ctaButton?.label && ctaButton?.href && (
                <div className="mt-6">
                  <Button
                    asChild
                    size="lg"
                  >
                    <Link href={ctaButton.href}>{ctaButton.label}</Link>
                  </Button>
                </div>
              )}
            </div>
          </Block>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        {displayTitle && (
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            {displayTitle}
          </h1>
        )}
        {description && (
          <p className="max-w-4xl text-base leading-relaxed text-muted-foreground whitespace-pre-line">
            {description}
          </p>
        )}
        {ctaButton?.label && ctaButton?.href && (
          <div className="mt-6">
            <Button asChild size="lg">
              <Link href={ctaButton.href}>{ctaButton.label}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
