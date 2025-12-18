import Link from "next/link";
import Image from "next/image";
import { buildImageUrl } from "@/lib/sanity/image";
import Block from "./Block";
import { News } from "~/sanity.types";

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

        <div className="grid gap-6 md:grid-cols-3">
          {resolvedItems?.map((item) => (
            <Link
              href={`/nyheter/${item.slug?.current}`}
              key={item._id}
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {item.mainImage && (
                <div className="relative aspect-[16/9]">
                  <Image
                    src={buildImageUrl(item.mainImage)}
                    alt={item.title ?? "Main image"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-4">
                <h3 className="font-semibold text-lg">{item.title}</h3>

                {item.excerpt && (
                  <p className="text-sm text-gray-600 mt-2">{item.excerpt}</p>
                )}
              </div>
            </Link>
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
