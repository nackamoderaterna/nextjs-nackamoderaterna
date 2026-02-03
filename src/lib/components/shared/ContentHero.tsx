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
  subtitle?: string;
  subtitleHref?: string;
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
  children,
}: ContentHeroProps) {
  const Icon = icon?.name ? getLucideIcon(icon.name) : null;
  const showImage = !!image;
  const showIcon = !showImage && !!Icon;

  return (
    <section className="border-b border-border rounded-lg pb-6 mb-6 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-start justify-start md:justify-center md:items-center gap-4">
        {showImage ? (
          <div className="relative h-auto aspect-square max-w-sm w-full lg:w-64 lg:h-64 rounded overflow-hidden shrink-0">
            <SanityImage
              image={image}
              alt=""
              fill
              priority
              sourceWidth={512}
              sourceHeight={512}
              className="object-cover rounded"
              sizes="(max-width: 1023px) 384px, 256px"
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
          {subtitle && subtitleHref ? (
            <Link
              href={subtitleHref}
              className="text-base text-muted-foreground hover:text-primary transition-colors"
            >
              {subtitle}
            </Link>
          ) : subtitle ? (
            <p className="text-base text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}
