import Link from "next/link";
import { formatDate } from "@/lib/utils/dateUtils";
import { ArrowRight } from "lucide-react";
import { NewsVariantBadge } from "./NewsVariantBadge";
import type { NewsVariant } from "@/types/news";
import { ROUTE_BASE } from "@/lib/routes";

export type PoliticalAreaRef = {
  _id: string;
  name: string;
  slug?: { current: string } | null;
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
}: NewsCardProps) {
  return (
    <article
      className={`group relative ${!isLast ? "border-b border-border" : ""}`}
    >
      <Link
        href={`${ROUTE_BASE.NEWS}/${slug}`}
        className="block py-8 md:py-10 lg:py-12 transition-colors hover:bg-accent/50"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          <div className="md:col-span-2 flex flex-col gap-2 items-start">
            <time className="text-xs md:text-sm font-mono uppercase tracking-wider text-muted-foreground">
              {formatDate(date)}
            </time>
            {variant && variant !== "default" && (
              <NewsVariantBadge variant={variant} />
            )}
           
          </div>

          <div className="md:col-span-8 space-y-3">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-balance group-hover:text-primary transition-colors">
                {title}
              </h2>
              {politicalAreas && politicalAreas.length > 0 && (
              <p className="text-xs uppercase text-muted-foreground mt-4 flex flex-wrap gap-4">
                {[...politicalAreas]
                  .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
                  .map((a) => (
                    <span key={a._id}>{a.name}</span>
                  ))}
              </p>
            )}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">
              {excerpt}
            </p>
            {series?.title && (
              <p className="text-xs capitalize text-muted-foreground mt-4">{series.title}</p>
              
            )}
           
          </div>

          <div className="md:col-span-2 flex items-center justify-start md:justify-end mr-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border group-hover:border-muted-foreground group-hover:bg-muted-foreground group-hover:text-background transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
