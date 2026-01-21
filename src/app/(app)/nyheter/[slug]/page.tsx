import { notFound } from "next/navigation";
import { sanityClient, REVALIDATE_TIME } from "@/lib/sanity/client";
import { NewsWithReferences } from "@/types/news";
import { newsQuery } from "@/lib/queries/nyheter";
import { ContentWithSidebar } from "@/lib/components/shared/ContentWithSidebar";
import { formatDate } from "@/lib/utils/dateUtils";
import { PortableText } from "next-sanity";
import { NewsSidebar } from "@/lib/components/news/NewsSidebar";
import { Metadata } from "next";
import { buildImageUrl } from "@/lib/sanity/image";
import { generateMetadata as generateSEOMetadata } from "@/lib/utils/seo";

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
    url: `/nyheter/${slug}`,
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
      next: { revalidate: REVALIDATE_TIME },
    }
  );

  if (!news) {
    notFound();
  }

  const mainContent = (
    <div>
      {news.politicalAreas && news.politicalAreas.length > 0 && (
        <div className="mb-4">
          <span className="inline-block text-sm font-medium text-blue-600">
            {news.politicalAreas[0].name}
          </span>
        </div>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
        {news.title}
      </h1>
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
          <PortableText value={news.body} />
        </div>
      )}
    </div>
  );

  const sidebar = <NewsSidebar news={news} />;

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <ContentWithSidebar mainContent={mainContent} sidebarContent={sidebar} />
    </div>
  );
}
