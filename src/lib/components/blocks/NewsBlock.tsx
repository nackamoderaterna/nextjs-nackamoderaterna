"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import Block from "./Block";
import { BlockHeading, getBlockHeading } from "./BlockHeading";
import { Button } from "@/lib/components/ui/button";
import { News } from "~/sanity.types";
import { NewsCard } from "../news/NewsCard";
import { getEffectiveDate } from "@/lib/utils/getEffectiveDate";
import { ROUTE_BASE } from "@/lib/routes";

const INITIAL_VISIBLE = 5;

export interface NewsBlockProps {
  _type: "block.news";
  heading?: { title?: string | null; subtitle?: string | null } | string;
  mode: "manual" | "latest" | "byPoliticalArea" | "byGeographicArea";
  viewAllLink?: string | null;
  resolvedItems: News[];
}

export function NewsBlock({ block }: { block: NewsBlockProps }) {
  const { title } = getBlockHeading(block);
  const resolvedItems = block.resolvedItems ?? [];
  const viewAllHref = block.viewAllLink?.trim() || ROUTE_BASE.NEWS;

  const [isExpanded, setIsExpanded] = useState(false);
  const initialItems = resolvedItems.slice(0, INITIAL_VISIBLE);
  const moreItems = resolvedItems.slice(INITIAL_VISIBLE);
  const hasMore = moreItems.length > 0;

  return (
    <Block>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <BlockHeading title={title} centered={false} className="mb-0" />
        <Link
          href={viewAllHref}
          className="shrink-0 text-sm font-medium text-primary hover:underline flex items-center gap-1"
        >
          Alla nyheter
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

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
            aria-hidden={!isExpanded}
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
              {isExpanded ? "Visa mindre" : "Läs mer"}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>
        </>
      )}
    </Block>
  );
}
