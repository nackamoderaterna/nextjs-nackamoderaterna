import Link from "next/link";

import { Button } from "@/lib/components/ui/button";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import { getObjectPositionFromHotspot } from "@/lib/sanity/imageHotspot";
import { buildImageUrl } from "@/lib/sanity/image";
import type { PageHeaderData } from "@/lib/types/pages";

interface PageHeroProps {
  title?: string;
  pageHeader?: PageHeaderData | null;
}

const imageHeightClasses: Record<string, string> = {
  small: "min-h-[350px] md:min-h-[400px]",
  medium: "min-h-[450px] md:min-h-[500px]",
  large: "min-h-[550px] md:min-h-[600px]",
  fullscreen: "min-h-[600px] md:min-h-screen",
};

export function PageHero({ title, pageHeader }: PageHeroProps) {
  const displayTitle = (pageHeader?.header?.trim() || title) ?? undefined;
  const description =
    typeof pageHeader?.description === "string"
      ? pageHeader.description
      : undefined;
  const headerImage = pageHeader?.image;
  const ctaButton = pageHeader?.ctaButton;
  const hasImage = headerImage != null;
  const imageHeight = pageHeader?.imageHeight || "medium";
  const overlayOpacity = pageHeader?.overlayOpacity ?? 40;

  const CtaIcon = ctaButton?.icon?.name
    ? getLucideIcon(ctaButton.icon.name)
    : null;

  if (hasImage) {
    const heightClass =
      imageHeightClasses[imageHeight] || imageHeightClasses.medium;
    const objectPosition = getObjectPositionFromHotspot(headerImage);
    const imageUrl = buildImageUrl(headerImage, {
      width: 1920,
      quality: 85,
    });

    const base = overlayOpacity / 100;

    return (
      <section
        className={`relative w-full overflow-hidden bg-background relative`}
      >
        <div className="mx-auto max-w-7xl h-full ">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Content */}
            <div className="flex h-full items-center">
              <div className="mx-auto w-full flex max-w-md px-4 py-16 sm:px-6 md:py-24 lg:px-8">
                <div className="flex flex-col max-w-sm justify-center gap-6">
                  {displayTitle && (
                    <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {displayTitle}
                    </h1>
                  )}
                  {description && (
                    <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground whitespace-pre-line md:text-lg animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                      {description}
                    </p>
                  )}
                  {ctaButton?.label && ctaButton?.href && (
                    <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                      <Button
                        asChild
                        size="lg"
                        className="shadow-lg shadow-primary/25"
                      >
                        <Link href={ctaButton.href}>
                          {CtaIcon && <CtaIcon className="h-4 w-4" />}
                          {ctaButton.label}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(
              to bottom,
              oklch(0.99 0 0 / 0.6) 0%,
              transparent 20%
            )`,
              }}
            />
          </div>
          {imageUrl && (
            <div className="relative h-full">
              <SanityImage
                image={headerImage}
                className="absolute inset-y-0 left-1/2 w-[50vw] hidden lg:block"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          )}
        </div>
      </section>
    );
  }

  // No image fallback — same as PageHeader's no-image variant
  return (
    <div className="w-full border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col max-w-xl gap-4">
          {displayTitle && (
            <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              {displayTitle}
            </h1>
          )}
          {description && (
            <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line md:text-lg animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              {description}
            </p>
          )}
          {ctaButton?.label && ctaButton?.href && (
            <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <Button asChild size="lg">
                <Link href={ctaButton.href}>
                  {CtaIcon && <CtaIcon className="h-4 w-4" />}
                  {ctaButton.label}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
