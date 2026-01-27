import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { NewsWithReferences } from "@/types/news";
import { newsQuery, allNewsSlugsQuery } from "@/lib/queries/nyheter";
import { ContentWithSidebar } from "@/lib/components/shared/ContentWithSidebar";
import { formatDate } from "@/lib/utils/dateUtils";
import { PortableText } from "next-sanity";
import { NewsSidebar } from "@/lib/components/news/NewsSidebar";
import { NewsVariantBadge } from "@/lib/components/news/NewsVariantBadge";
import { portableTextComponents } from "@/lib/components/shared/PortableTextComponents";
import { Metadata } from "next";
import { buildImageUrl } from "@/lib/sanity/image";
import { generateMetadata as generateSEOMetadata } from "@/lib/utils/seo";
import { ROUTE_BASE } from "@/lib/routes";
import Link from "next/link";

// Generate static params for all news articles at build time
export async function generateStaticParams() {
  const news = await sanityClient.fetch<{ slug: string }[]>(
    allNewsSlugsQuery
  );
  
  return news.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await sanityClient.fetch<NewsWithReferences>(newsQuery, { slug });

  if (!news) {
    return generateSEOMetadata({
      title: "Artikel hittades inte",
      description: "Den begärda artikeln kunde inte hittas",
    });
  }

  const imageUrl = news.mainImage
    ? buildImageUrl(news.mainImage, { width: 1200, height: 630 })
    : undefined;

  return generateSEOMetadata({
    title: `${news.title} | Nackamoderaterna`,
    description: news.excerpt || undefined,
    image: imageUrl,
    url: `${ROUTE_BASE.NEWS}/${slug}`,
    type: "article",
    publishedTime: news.effectiveDate,
  });
}

export const revalidate = 300;

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const news = await sanityClient.fetch<NewsWithReferences>(
    newsQuery,
    { slug },
    {
      next: { revalidate: 300 },
    }
  );

  if (!news) {
    notFound();
  }

  const mainContent = (
    <div className="px-4">
      <div className="mb-4 flex flex-wrap items-center gap-4">
       
        {news.variant && news.variant !== "default" && (
          <NewsVariantBadge variant={news.variant} />
        )}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
        {news.title}
      </h1>
      {news.politicalAreas && news.politicalAreas.length > 0 && (

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {news.politicalAreas.map((area) => (
              <Link href={`${ROUTE_BASE.POLITICS}/${area.slug?.current}`} key={area._id}>
              <span className="inline-block text-sm rounded-full px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900 transition-colors">
                {area.name}
              </span>
              </Link>
            ))}
            </div>
        )}
      <time
        dateTime={news.effectiveDate}
        className="text-sm text-muted-foreground"
      >
        {formatDate(news.effectiveDate)}
      </time>

      <h2 className="text-xl font-medium text-foreground mt-8">
        {news.excerpt}
      </h2>
      {news.body && (
        <div className="prose md:prose-lg mt-8">
          <PortableText value={news.body} components={portableTextComponents} />
        </div>
      )}
    </div>
  );

  const sidebar = <NewsSidebar news={news} />;

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <ContentWithSidebar mainContent={mainContent} sidebarContent={sidebar} />
    </div>
  );
}
