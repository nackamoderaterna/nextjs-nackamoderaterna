import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { NewsExpanded } from "@/lib/types/news";
import { newsQuery, allNewsSlugsQuery } from "@/lib/queries/nyheter";
import { NewsArticleImage } from "@/lib/components/news/NewsArticleImage";
import { Section } from "@/lib/components/shared/Section";
import { SetBreadcrumbTitle } from "@/lib/components/shared/BreadcrumbTitleContext";
import { formatDate } from "@/lib/utils/dateUtils";
import { PortableText } from "next-sanity";
import { NewsSidebar } from "@/lib/components/news/NewsSidebar";
import { NewsVariantBadge } from "@/lib/components/news/NewsVariantBadge";
import { portableTextComponents } from "@/lib/components/shared/PortableTextComponents";
import { Metadata } from "next";
import { buildImageUrl } from "@/lib/sanity/image";
import {
  generateMetadata as generateSEOMetadata,
  getGlobalSeoDefaults,
} from "@/lib/utils/seo";
import { ROUTE_BASE } from "@/lib/routes";
import { buildBreadcrumbJsonLd } from "@/lib/utils/breadcrumbJsonLd";
import Link from "next/link";
import { NewsCard } from "@/lib/components/news/NewsCard";
import { getLucideIcon } from "@/lib/utils/iconUtils";

// Generate static params for all news articles at build time
export async function generateStaticParams() {
  const news = await sanityClient.fetch<{ slug: string }[]>(allNewsSlugsQuery);

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
  const [news, defaults] = await Promise.all([
    sanityClient.fetch<NewsExpanded>(
      newsQuery,
      { slug },
      { next: { revalidate: 86400 } },
    ),
    getGlobalSeoDefaults(),
  ]);

  if (!news) {
    return generateSEOMetadata({
      title: "Artikel hittades inte",
      description: "Den begärda artikeln kunde inte hittas",
    });
  }

  const imageUrl =
    news.mainImage && (news.mainImage as { asset?: unknown }).asset
      ? buildImageUrl(news.mainImage, { width: 1200, height: 630 })
      : defaults.image;

  return generateSEOMetadata({
    title: `${news.title} | Nackamoderaterna`,
    description: news.excerpt || undefined,
    image: imageUrl,
    url: `${ROUTE_BASE.NEWS}/${slug}`,
    type: "article",
    publishedTime: news.effectiveDate,
    modifiedTime: (news as unknown as { _updatedAt?: string })._updatedAt,
  });
}

export const revalidate = 86400;

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const news = await sanityClient.fetch<NewsExpanded>(
    newsQuery,
    { slug },
    {
      next: { revalidate: 86400 },
    },
  );

  if (!news) {
    notFound();
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://nackamoderaterna.se";
  const imageUrl =
    news.mainImage && (news.mainImage as { asset?: unknown }).asset
      ? buildImageUrl(news.mainImage, { width: 1200, height: 630 })
      : undefined;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Hem", url: "/" },
    { name: "Nyheter", url: ROUTE_BASE.NEWS },
    { name: news.title ?? slug },
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    datePublished: news.effectiveDate,
    dateModified:
      (news as unknown as { _updatedAt?: string })._updatedAt ||
      news.effectiveDate,
    image: imageUrl,
    description: news.excerpt || undefined,
    url: `${siteUrl}${ROUTE_BASE.NEWS}/${slug}`,
    author: {
      "@type": "Organization",
      name: "Nackamoderaterna",
    },
    publisher: {
      "@type": "Organization",
      name: "Nackamoderaterna",
    },
  };

  const mainContent = (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {news.variant && news.variant !== "default" && (
          <NewsVariantBadge variant={news.variant} />
        )}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance break-words">
        {news.title}
      </h1>
      {news.politicalAreas && news.politicalAreas.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {news.politicalAreas.map((area) => {
            const Icon = area.icon?.name ? getLucideIcon(area.icon.name) : null;
            return (
              <Link
                href={`${ROUTE_BASE.POLITICS_CATEGORY}/${area.slug?.current || ""}`}
                key={area._id}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors text-sm"
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                {area.name}
              </Link>
            );
          })}
        </div>
      )}
      <time
        dateTime={news.effectiveDate}
        className="text-sm text-muted-foreground"
      >
        {formatDate(news.effectiveDate)}
      </time>

      <h2 className="text-xl max-w-3xl font-medium text-foreground mt-8">
        {news.excerpt}
      </h2>
      {news.body && (
        <div className="mt-8 max-w-3xl">
          <PortableText value={news.body} components={portableTextComponents} />
        </div>
      )}
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto mt-8 px-4">
        <SetBreadcrumbTitle title={news.title ?? ""} />
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image: top on mobile, top of right column on desktop */}
          {news.mainImage && (
            <div className="order-1 lg:col-start-3 lg:row-start-1">
              <NewsArticleImage news={news} />
            </div>
          )}
          {/* Article body: second on mobile, left two columns spanning both rows on desktop */}
          <div className="order-2 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:row-span-2">
            {mainContent}
          </div>
          {/* Sidebar: below article on mobile, below image on desktop */}
          <aside className="order-3 lg:col-start-3 lg:row-start-2">
            <NewsSidebar news={news} currentSlug={slug} />
          </aside>
        </div>

        {news.relatedByPoliticalArea &&
          news.relatedByPoliticalArea.length > 0 && (
            <Section
              title="Relaterade nyheter"
              className="mt-16"
              aria-label="Relaterade nyheter"
            >
              <div className="rounded-lg overflow-hidden">
                <div className="grid">
                  {news.relatedByPoliticalArea.map((item, index) => (
                    <NewsCard
                      key={item._id}
                      title={item.title || ""}
                      isLast={index === news.relatedByPoliticalArea!.length - 1}
                      date={item.effectiveDate}
                      slug={item.slug?.current || ""}
                      excerpt={item.excerpt || ""}
                    />
                  ))}
                </div>
              </div>
            </Section>
          )}
      </div>
    </>
  );
}
