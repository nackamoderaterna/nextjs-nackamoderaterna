import { notFound } from "next/navigation";
import { NewsCard } from "@/lib/components/news/NewsCard";
import { PoliticianCardSmall } from "@/lib/components/politician/PoliticianCardSmall";
import { PoliticalAreaHero } from "@/lib/components/politics/politicalAreaHero";
import { ContentWithSidebar } from "@/lib/components/shared/ContentWithSidebar";
import { geographicalAreaPageQuery } from "@/lib/queries/politik";
import { sanityClient } from "@/lib/sanity/client";
import { formatDate } from "@/lib/utils/dateUtils";
import { generateMetadata as generateSEOMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { PortableText } from "next-sanity";
import Link from "next/link";
import { News, GeographicalArea, Politician } from "~/sanity.types";
import { cleanPoliticianData, PoliticianWithNamnd } from "@/lib/politicians";
import { ROUTE_BASE } from "@/lib/routes";

export type GeographicalAreaPage = Omit<GeographicalArea, never> & {
  latestNews: News[];
  politicians: Politician[];
};

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await sanityClient.fetch<GeographicalAreaPage>(
    geographicalAreaPageQuery,
    { slug }
  );

  if (!data) {
    return generateSEOMetadata({
      title: "Område hittades inte",
      description: "Det begärda området kunde inte hittas",
    });
  }

  return generateSEOMetadata({
    title: `${data.name} | Nackamoderaterna`,
    description: data.description
      ? `${data.name} - ${data.description[0]?.children?.[0]?.text?.substring(0, 150)}...`
      : `Läs mer om ${data.name}`,
    url: `/omrade/${slug}`,
  });
}

export const revalidate = 300;

export default async function GeographicalAreaSinglePage({ params }: Props) {
  const { slug } = await params;
  const data = await sanityClient.fetch<GeographicalAreaPage>(
    geographicalAreaPageQuery,
    { slug },
    {
      next: { revalidate: 300 },
    }
  );

  if (!data) {
    notFound();
  }

  // Clean politician data (query returns Politician; cleanPoliticianData expects PoliticianWithNamnd)
  const cleanedPoliticians = (
    data.politicians as unknown as PoliticianWithNamnd[]
  ).map(cleanPoliticianData);

  const mainContent = (
    <div className="space-y-8 prose md:prose-lg">
      <div className="prose md:prose-lg">
        {data.description && <PortableText value={data.description} />}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PoliticalAreaHero image={data.image} title={data.name || ""} />

          <ContentWithSidebar
            mainContent={mainContent}
            sidebarContent={null}
          />

          {/* Current News Section */}
          {data.latestNews.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Aktuellt inom {data.name}
              </h2>
              <div className="grid">
                {data.latestNews.map((news, index) => (
                  <NewsCard
                    key={news._id}
                    date={formatDate(
                      news.dateOverride ? news.dateOverride : news._createdAt,
                    )}
                    slug={news.slug?.current || ""}
                    title={news.title || ""}
                    isLast={index === data.latestNews.length - 1}
                    excerpt={news.excerpt || ""}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Local Politicians Section */}
          {cleanedPoliticians.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Dina lokala politiker
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cleanedPoliticians.map((politician) => (
                  <Link
                    key={politician._id}
                    href={`${ROUTE_BASE.POLITICIANS}/${politician.slug?.current || ""}`}
                    className="block"
                  >
                    <PoliticianCardSmall
                      name={politician.name}
                      image={politician.image}
                      subtitle=""
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
