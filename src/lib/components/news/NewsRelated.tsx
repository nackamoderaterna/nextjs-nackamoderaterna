// components/news/NewsRelated.tsx
import { NewsWithReferences } from "@/app/(app)/nyheter/[slug]/page";
import Link from "next/link";
import { SanityImage } from "../shared/SanityImage";

export function NewsRelated({ news }: { news: NewsWithReferences }) {
  if (!news.relatedNews || news.relatedNews.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Relaterade nyheter
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.relatedNews.map((related) => {
          const date = new Date(related.effectiveDate);
          const formattedDate = date.toLocaleDateString("sv-SE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return (
            <Link
              key={related._id}
              href={`/nyheter/${related.slug.current}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
            >
              {related.mainImage && (
                <div className="aspect-video relative bg-gray-200">
                  <SanityImage
                    image={related.mainImage}
                    alt={related.mainImage.alt || related.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 flex-1">
                <time className="text-xs text-gray-500 mb-2 block">
                  {formattedDate}
                </time>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {related.title}
                </h3>
                {related.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {related.excerpt}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
