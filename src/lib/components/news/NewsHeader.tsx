import { NewsWithReferences } from "@/app/(app)/nyheter/[slug]/page";
import { SanityImage } from "../shared/SanityImage";

export function NewsHeader({ news }: { news: NewsWithReferences }) {
  const date = new Date(news.effectiveDate);
  const formattedDate = date.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header>
      {news.mainImage && (
        <div className="relative bg-gray-200 w-full h-[500px]">
          <SanityImage
            fill
            image={news.mainImage}
            alt={news.mainImage.alt || news.title}
          />
        </div>
      )}

      <div className="p-6 md:p-8">
        <time className="text-sm text-gray-500 mb-2 block">
          {formattedDate}
        </time>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {news.title}
        </h1>
        {news.excerpt && (
          <p className="text-lg text-gray-600 leading-relaxed">
            {news.excerpt}
          </p>
        )}
      </div>
    </header>
  );
}
