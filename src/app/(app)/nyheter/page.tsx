// app/nyheter/page.tsx
import { NewsCard } from "@/lib/components/news/NewsCard";
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
  _updatedAt,
  dateOverride,
  _rev,
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
  | "_updatedAt"
  | "_rev"
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

        <div className="grid">
          {newsList.map((news, index) => (
            <NewsCard
              key={news._id}
              title={news.title || ""}
              isLast={index === newsList.length - 1}
              date={news.dateOverride ? news.dateOverride : news._createdAt}
              slug={news.slug?.current || ""}
              excerpt={news.excerpt || ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
