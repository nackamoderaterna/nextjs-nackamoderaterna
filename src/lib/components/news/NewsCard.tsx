import Link from "next/link";
import { formatDate } from "@/lib/utils/dateUtils";
import { ArrowRight } from "lucide-react";
import { NewsVariantBadge } from "./NewsVariantBadge";
import { CategoryBadge } from "@/lib/components/politics/CategoryBadge";
import type { NewsVariant } from "@/lib/types/news";
import { ROUTE_BASE } from "@/lib/routes";

export type PoliticalAreaRef = {
  _id: string;
  name: string;
  slug?: { current: string } | null;
  icon?: { name?: string | null } | null;
};

export type SeriesRef = {
  _id: string;
  title?: string;
  slug?: { current: string } | null;
};

interface NewsCardProps {
  date: string;
  slug: string;
  title: string;
  isLast: boolean;
  excerpt: string;
  variant?: NewsVariant | null;
  politicalAreas?: PoliticalAreaRef[] | null;
  series?: SeriesRef | null;
  headingLevel?: "h2" | "h3";
}

export function NewsCard({
  date,
  title,
  excerpt,
  slug,
  isLast,
  variant,
  politicalAreas,
  series,
  headingLevel: Heading = "h3",
}: NewsCardProps) {
  const articleHref = `${ROUTE_BASE.NEWS}/${slug}`;

  return (
    <article
      className={`group relative transition-colors hover:bg-accent/50 ${!isLast ? "border-b border-border" : ""}`}
    >
      {/*
        Stretched link covers the whole card for mouse/touch users.
        aria-hidden + tabIndex={-1} keeps it out of the a11y tree —
        the heading link below is the real accessible link.
      */}
      <Link
        href={articleHref}
        className="absolute inset-0"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="py-5 md:py-6 lg:py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          <div className="md:col-span-2 flex flex-col gap-2 items-start">
            <time className="text-xs md:text-sm font-mono tracking-wider text-muted-foreground">
              {formatDate(date)}
            </time>
          </div>

          <div className="md:col-span-8 space-y-3">
            <div className="space-y-2">
              <Heading className="text-2xl md:text-3xl lg:text-4xl font-light text-balance min-w-0">
                {/* Accessible link on the heading title */}
                <Link
                  href={articleHref}
                  className="group-hover:text-primary transition-colors"
                >
                  {title}
                </Link>
              </Heading>
              {variant && variant !== "default" && (
                <NewsVariantBadge
                  variant={variant}
                  className="shrink-0"
                  linkToFilter={false}
                />
              )}
              {politicalAreas && politicalAreas.length > 0 && (
                <div className="text-xs uppercase text-muted-foreground mt-4 flex flex-wrap gap-4">
                  {[...politicalAreas]
                    .sort((a, b) =>
                      (a.name ?? "").localeCompare(b.name ?? "", "sv"),
                    )
                    .map((a) => (
                      <CategoryBadge
                        key={a._id}
                        name={a.name ?? ""}
                        icon={a.icon}
                        size="default"
                        variant="brand"
                      />
                    ))}
                </div>
              )}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">
              {excerpt}
            </p>
            {series?.title && (
              <p className="text-xs capitalize text-muted-foreground mt-4">
                {series.title}
              </p>
            )}
          </div>

          <div className="md:col-span-2 flex items-center justify-start md:justify-end mr-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border group-hover:border-muted-foreground group-hover:bg-brand-primary group-hover:text-background transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
