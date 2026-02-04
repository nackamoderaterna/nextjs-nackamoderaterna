"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { NewsCard } from "./NewsCard";
import { getEffectiveDate } from "@/lib/utils/getEffectiveDate";
import { ROUTE_BASE } from "@/lib/routes";

export type ExpandableNewsItem = {
  _id: string;
  title?: string | null;
  slug?: { current?: string } | null;
  excerpt?: string | null;
  dateOverride?: string | null;
  _createdAt?: string;
  effectiveDate?: string;
};

interface ExpandableNewsListProps {
  items: ExpandableNewsItem[];
  initialVisible: number;
  viewAllHref?: string;
  title?: React.ReactNode;
  titleAction?: React.ReactNode;
  /** Extra class for the wrapper (e.g. for Section spacing). */
  className?: string;
}

export function ExpandableNewsList({
  items,
  initialVisible,
  viewAllHref = ROUTE_BASE.NEWS,
  title,
  titleAction,
  className,
}: ExpandableNewsListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const initialItems = items.slice(0, initialVisible);
  const moreItems = items.slice(initialVisible);
  const hasMore = moreItems.length > 0;

  return (
    <div className={className}>
      {(title || titleAction) && (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {title && <>{title}</>}
          {titleAction ?? (
            <Link
              href={viewAllHref}
              className="shrink-0 text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              Alla nyheter
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}

      <div className="grid">
        {initialItems.map((item, index) => (
          <NewsCard
            key={item._id}
            isLast={!hasMore && index === initialItems.length - 1}
            date={getEffectiveDate(item)}
            slug={item.slug?.current || ""}
            title={item.title || ""}
            excerpt={item.excerpt || ""}
          />
        ))}
      </div>

      {hasMore && (
        <>
          <div
            className={`
              overflow-hidden transition-[max-height] duration-300 ease-in-out
              ${isExpanded ? "max-h-[5000px]" : "max-h-0"}
            `}
            {...(!isExpanded ? { inert: true } : undefined)}
          >
            <div className="grid border-t border-border">
              {moreItems.map((item, index) => (
                <NewsCard
                  key={item._id}
                  isLast={index === moreItems.length - 1}
                  date={getEffectiveDate(item)}
                  slug={item.slug?.current || ""}
                  title={item.title || ""}
                  excerpt={item.excerpt || ""}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
            >
              {isExpanded ? "Visa färre" : "Visa fler"}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
