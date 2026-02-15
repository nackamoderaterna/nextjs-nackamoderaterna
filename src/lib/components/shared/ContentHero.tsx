import Link from "next/link";
import { type ReactNode } from "react";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { getLucideIcon } from "@/lib/utils/iconUtils";

interface ContentHeroProps {
  title: string;
  /** Small label above the title (e.g. "OMRÅDE", "EVENEMANG") */
  pageType?: string | null;
  image?: unknown;
  icon?: { name?: string | null } | null;
  subtitle?: ReactNode;
  subtitleHref?: string;
  /** Controls whether the image appears to the left (default) or right of the text */
  imagePosition?: "left" | "right";
  /** "default" uses a compact image; "wide" uses a larger landscape image, contained in height */
  variant?: "default" | "wide";
  /** Rendered below the hero block, inside the section and above the border */
  children?: ReactNode;
}

export function ContentHero({
  title,
  pageType,
  image,
  icon,
  subtitle,
  subtitleHref,
  imagePosition = "left",
  variant = "default",
  children,
}: ContentHeroProps) {
  const Icon = icon?.name ? getLucideIcon(icon.name) : null;
  const showImage = !!image;
  const showIcon = !showImage && !!Icon;
  const isRight = imagePosition === "right";

  const imageClasses =
    variant === "wide"
      ? "aspect-[16/9] max-h-[320px] w-full lg:max-w-lg lg:max-h-[280px]"
      : isRight
        ? "aspect-[4/3] max-w-md w-full lg:w-80 lg:h-auto"
        : "h-auto aspect-square max-w-sm w-full lg:w-64 lg:h-64";

  const imageSourceWidth = variant === "wide" ? 800 : isRight ? 640 : 512;
  const imageSourceHeight = variant === "wide" ? 450 : isRight ? 480 : 512;

  return (
    <section className="border-b border-border rounded-lg pb-6 mb-6 flex flex-col gap-4">
      <div className={`flex flex-col ${isRight ? "md:flex-row-reverse" : "md:flex-row"} items-start justify-start md:justify-center md:items-center gap-4`}>
        {showImage ? (
          <div className={`relative rounded overflow-hidden shrink-0 ${imageClasses}`}>
            <SanityImage
              image={image}
              alt=""
              fill
              priority
              sourceWidth={imageSourceWidth}
              sourceHeight={imageSourceHeight}
              className="object-cover rounded"
              sizes={variant === "wide" ? "(max-width: 1023px) 100vw, 512px" : isRight ? "(max-width: 1023px) 448px, 320px" : "(max-width: 1023px) 384px, 256px"}
            />
          </div>
        ) : showIcon ? (
          <div className="flex md:h-24 md:w-24 h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
            <Icon className="h-7 w-7 text-brand-primary" />
          </div>
        ) : null}
        <div className="flex flex-col gap-2 w-full ">
          {pageType ? (
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              {pageType}
            </p>
          ) : null}
          <h1 className="text-4xl font-bold text-foreground">{title}</h1>
          {subtitle && subtitleHref && typeof subtitle === "string" ? (
            <Link
              href={subtitleHref}
              className="text-base text-muted-foreground hover:text-primary transition-colors"
            >
              {subtitle}
            </Link>
          ) : subtitle ? (
            <div className="text-base text-muted-foreground">{subtitle}</div>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}
