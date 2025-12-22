// app/nyheter/page.tsx
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { sanityClient } from "@/lib/sanity/client";
import { groq } from "next-sanity";
import Link from "next/link";
import { News } from "~/sanity.types";

const newsListQuery = groq`*[_type == "news"] | order(
  coalesce(dateOverride, _createdAt) desc
) {
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  _createdAt,
  dateOverride,
  "effectiveDate": coalesce(dateOverride, _createdAt),
  "politicalAreas": politicalAreas[]-> {
    _id,
    title
  }
}`;

type NewsListItem = Pick<
  News,
  | "_id"
  | "title"
  | "slug"
  | "excerpt"
  | "mainImage"
  | "_createdAt"
  | "dateOverride"
> & {
  effectiveDate: string;
  politicalAreas?: Array<{
    _id: string;
    title: string;
  }>;
};

export default async function NewsPage() {
  const newsList = await sanityClient.fetch<NewsListItem[]>(newsListQuery);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Nyheter</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((news) => (
            <NewsCard key={news._id} news={news} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsCard({ news }: { news: NewsListItem }) {
  const date = new Date(news.effectiveDate);
  const formattedDate = date.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/nyheter/${news.slug?.current}`}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
    >
      {news.mainImage && (
        <div className="aspect-video relative bg-gray-200">
          <SanityImage
            image={news.mainImage}
            alt={news.mainImage.alt || news.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        <time className="text-xs text-gray-500 mb-2">{formattedDate}</time>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {news.title}
        </h2>

        {news.excerpt && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {news.excerpt}
          </p>
        )}

        {news.politicalAreas && news.politicalAreas.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1">
            {news.politicalAreas.slice(0, 2).map((area) => (
              <span
                key={area._id}
                className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {area.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
