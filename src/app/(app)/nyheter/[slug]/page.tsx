import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import Link from "next/link";
import { News } from "~/sanity.types";
import { sanityClient } from "@/lib/sanity/client";
import { NewsHeader } from "@/lib/components/news/NewsHeader";
import { NewsBody } from "@/lib/components/news/NewsBody";
import { NewsMetadata } from "@/lib/components/news/NewsMetadata";
import { NewsRelated } from "@/lib/components/news/NewsRelated";

const newsQuery = groq`*[_type == "news" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  body,
  _createdAt,
  dateOverride,
  "effectiveDate": coalesce(dateOverride, _createdAt),
  "referencedPoliticians": referencedPolitician[]-> {
    _id,
    name,
    slug,
    image
  },
  "politicalAreas": politicalAreas[]-> {
    _id,
    name,
    slug
  },
  "geographicalAreas": geographicalAreas[]-> {
    _id,
    name,
    slug
  },
  "relatedNews": related[]-> {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    "effectiveDate": coalesce(dateOverride, _createdAt)
  }
}`;

export type NewsWithReferences = Omit<
  News,
  "referencedPolitician" | "politicalAreas" | "geographicalAreas" | "related"
> & {
  effectiveDate: string;
  referencedPoliticians?: Array<{
    _id: string;
    name: string;
    slug: { current: string };
    image?: any;
  }>;
  politicalAreas?: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  geographicalAreas?: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  relatedNews?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    excerpt?: string;
    mainImage?: any;
    effectiveDate: string;
  }>;
};

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const news = await sanityClient.fetch<NewsWithReferences>(newsQuery, {
    slug,
  });

  if (!news) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/nyheter"
          className="text-sm text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Tillbaka till nyheter
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <NewsHeader news={news} />
          <NewsBody news={news} />
          <NewsMetadata news={news} />
        </article>

        <NewsRelated news={news} />
      </div>
    </div>
  );
}
