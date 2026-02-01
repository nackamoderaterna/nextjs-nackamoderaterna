"use client";

import Block from "./Block";
import { BlockHeading, getBlockHeading } from "./BlockHeading";
import { ExpandableNewsList } from "../news/ExpandableNewsList";
import { News } from "~/sanity.types";
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

  return (
    <Block>
      <ExpandableNewsList
        items={resolvedItems}
        initialVisible={INITIAL_VISIBLE}
        viewAllHref={viewAllHref}
        title={<BlockHeading title={title} centered={false} className="mb-0" />}
      />
    </Block>
  );
}
