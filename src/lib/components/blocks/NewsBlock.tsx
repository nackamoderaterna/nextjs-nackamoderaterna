import Block from "./Block";
import { News } from "~/sanity.types";
import { NewsCard } from "../news/NewsCard";

export interface NewsBlockProps {
  _type: "block.news";
  title?: string;
  mode: "manual" | "latest" | "byPoliticalArea" | "byGeographicArea";
  limit?: number;
  resolvedItems: News[];
}

export function NewsBlock({ block }: { block: NewsBlockProps }) {
  const { title, resolvedItems } = block;

  return (
    <Block>
      <section className="my-12">
        {title && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
        )}

        <div className="grid">
          {resolvedItems?.map((item, index) => {
            const date = (item as any).effectiveDate || item.dateOverride || item._createdAt;
            return (
              <NewsCard
                key={item._id}
                isLast={index === resolvedItems.length - 1}
                date={date}
                slug={item.slug?.current || ""}
                title={item.title || ""}
                excerpt={item.excerpt || ""}
              />
            );
          })}
        </div>
      </section>
    </Block>
  );
}
