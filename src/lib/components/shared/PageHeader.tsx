import Link from "next/link";

import Block from "../blocks/Block";
import { Button } from "@/lib/components/ui/button";
import { SanityImage } from "./SanityImage";
import type { PageHeaderData } from "@/lib/types/pages";

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
  const ctaButton = pageHeader?.ctaButton;
  const hasImage = headerImage != null;

  const textContent = (
    <div className="flex flex-col justify-center gap-4">
      {displayTitle && (
        <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
          {displayTitle}
        </h1>
      )}
      {description && (
        <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line md:text-lg">
          {description}
        </p>
      )}
      {ctaButton?.label && ctaButton?.href && (
        <div className="mt-2">
          <Button asChild size="lg">
            <Link href={ctaButton.href}>{ctaButton.label}</Link>
          </Button>
        </div>
      )}
    </div>
  );

  if (hasImage) {
    return (
      <Block paddingY="none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 items-center grid0">
          {textContent}
          <div className="rounded order-first md:order-none overflow-hidden relative aspect-[4/3] md:aspect-auto md:col-span-2 md:h-full md:min-h-120">
            <SanityImage
              image={headerImage}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 75vw"
              className="object-cover h-full"
              priority
            />
          </div>
        </div>
      </Block>
    );
  }

  return <Block paddingY="medium">{textContent}</Block>;
}
