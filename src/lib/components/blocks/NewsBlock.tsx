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
            <p className="text-gray-500 text-sm capitalize">
              {mode === "manual" && "Manuellt utvalda nyheter"}
              {mode === "latest" && "Senaste nyheterna"}
              {mode === "byPoliticalArea" && "Nyheter inom politiskt område"}
              {mode === "byGeographicArea" && "Nyheter inom geografiskt område"}
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {resolvedItems?.map((item) => (
            <NewsCard key={item._id} item={item} />
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
