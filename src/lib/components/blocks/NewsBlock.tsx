import Block from "./Block";
import { News } from "~/sanity.types";
import { NewsCard } from "../news/NewsCard";
import { getEffectiveDate } from "@/lib/utils/getEffectiveDate";

export interface NewsBlockProps {
  _type: "block.news";
  heading?: string;
  mode: "manual" | "latest" | "byPoliticalArea" | "byGeographicArea";
  limit?: number;
  resolvedItems: News[];
}

export function NewsBlock({ block }: { block: NewsBlockProps }) {
  const { heading, resolvedItems } = block;

  return (
    <Block>
        {heading && (
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center">{heading}</h2>
          </div>
        )}

        <div className="grid">
          {resolvedItems?.map((item, index) => {
            return (
              <NewsCard
                key={item._id}
                isLast={index === resolvedItems.length - 1}
                date={getEffectiveDate(item)}
                slug={item.slug?.current || ""}
                title={item.title || ""}
                excerpt={item.excerpt || ""}
              />
            );
          })}
        </div>
    </Block>
  );
}
