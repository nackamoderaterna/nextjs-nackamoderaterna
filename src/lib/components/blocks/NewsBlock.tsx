import Link from "next/link";
import Image from "next/image";
import { buildImageUrl } from "@/lib/sanity/image";
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
  const { title, resolvedItems, mode } = block;

  return (
    <Block>
      <section className="my-12">
        {title && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
        )}

        <div className="grid">
          {resolvedItems?.map((item, index) => (
            <NewsCard
              key={item._id}
              isLast={index === resolvedItems.length - 1}
              date={item.dateOverride ? item.dateOverride : item._createdAt}
              slug={item.slug?.current || ""}
              title={item.title || ""}
              excerpt={item.excerpt || ""}
            />
          ))}
        </div>
      </section>
    </Block>
  );

  // {item.publishedAt && (
  //   <p className="text-xs text-gray-400 mt-3">
  //     {new Date(item.publishedAt).toLocaleDateString("sv-SE")}
  //   </p>
  // )}
}
