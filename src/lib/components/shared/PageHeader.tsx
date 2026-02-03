import Link from "next/link";

import Block from "../blocks/Block";
import { Button } from "@/lib/components/ui/button";
import { SanityImage } from "./SanityImage";
import { getLucideIcon } from "@/lib/utils/iconUtils";
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
    <div className="flex flex-col max-w-sm justify-center gap-4">
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
      {ctaButton?.label && ctaButton?.href && (() => {
        const CtaIcon = getLucideIcon(ctaButton.icon?.name);
        return (
          <div className="mt-2">
            <Button asChild size="lg">
              <Link href={ctaButton.href}>
                {CtaIcon && <CtaIcon className="h-4 w-4" />}
                {ctaButton.label}
              </Link>
            </Button>
          </div>
        );
      })()}
    </div>
  );

  if (hasImage) {
    return (
      <Block paddingY="medium">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-stretch min-h-[300px] md:min-h-[400px]">
          <div className="flex items-center md:flex-shrink-0">
            {textContent}
          </div>
          <div className="relative flex-1 rounded overflow-hidden order-first md:order-none min-h-[200px]">
            <SanityImage
              image={headerImage}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Block>
    );
  }

  return <Block paddingY="medium">{textContent}</Block>;
}
