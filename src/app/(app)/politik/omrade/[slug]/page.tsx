import { notFound } from "next/navigation";
import { NewsCard } from "@/lib/components/news/NewsCard";
import { PoliticalAreaHero } from "@/lib/components/politics/politicalAreaHero";
import { PolicyList } from "@/lib/components/politics/policyList";
import { ContentWithSidebar } from "@/lib/components/shared/ContentWithSidebar";
import { Section } from "@/lib/components/shared/Section";
import { geographicalAreaPageQuery, allGeographicalAreaSlugsQuery } from "@/lib/queries/politik";
import { sanityClient } from "@/lib/sanity/client";
import { buildImageUrl } from "@/lib/sanity/image";
import { generateMetadata as generateSEOMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { PortableText } from "next-sanity";
import { News, GeographicalArea, Politician, PoliticalIssue } from "~/sanity.types";
import { portableTextComponents } from "@/lib/components/shared/PortableTextComponents";
import { cleanPoliticianData, PoliticianWithNamnd } from "@/lib/politicians";
import { ROUTE_BASE } from "@/lib/routes";
import { getEffectiveDate } from "@/lib/utils/getEffectiveDate";
import { PeopleCard } from "@/lib/components/politician/PeopleCard";
import { Sidebar } from "@/lib/components/shared/Sidebar";

// Generate static params for all geographical areas at build time
export async function generateStaticParams() {
  const areas = await sanityClient.fetch<{ slug: string }[]>(
    allGeographicalAreaSlugsQuery
  );
  
  return areas.map((area) => ({
    slug: area.slug,
  }));
}

export type GeographicalAreaPage = Omit<GeographicalArea, never> & {
  latestNews: News[];
  politicalIssues: PoliticalIssue[];
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

  const imageUrl = data.image
    ? buildImageUrl(data.image, { width: 1200, height: 630 })
    : undefined;

  return generateSEOMetadata({
    title: `${data.name} | Nackamoderaterna`,
    description: data.description
      ? `${data.name} - ${data.description[0]?.children?.[0]?.text?.substring(0, 150)}...`
      : `Läs mer om ${data.name}`,
    image: imageUrl,
    url: `${ROUTE_BASE.POLITICS_AREA}/${slug}`,
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

  // Sort politicians: 1) Kommunalråd, 2) Nämnd leaders, 3) Party board, 4) The rest
  // Within each group, sort alphabetically by name
  const sortedPoliticians = [...cleanedPoliticians].sort((a, b) => {
    const getPriority = (p: typeof a) => {
      if (p.kommunalrad?.active) return 1;
      if (p.namndPositions?.some((n) => n.isLeader === true)) return 2;
      if (p.partyBoard?.active) return 3;
      return 4;
    };

    const priorityA = getPriority(a);
    const priorityB = getPriority(b);
    if (priorityA !== priorityB) return priorityA - priorityB;
    return (a.name || "").localeCompare(b.name || "", "sv");
  });

  const main = (
    <div className="space-y-8 prose md:prose-lg">
      <div className="prose md:prose-lg">
        {data.description && <PortableText value={data.description} components={portableTextComponents} />}
      </div>
    </div>
  );

  const sidebar =
    data.politicalIssues?.length > 0 ? (
      <Sidebar heading="Våra politikiska mål">
      <PolicyList policies={data.politicalIssues} />
      </Sidebar>
    ) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PoliticalAreaHero image={data.image} title={data.name || ""} />

          <ContentWithSidebar
            mainContent={main}
            sidebarContent={sidebar}
          />

          {/* Current News Section */}
          {data.latestNews.length > 0 && (
            <Section title={`Aktuellt inom ${data.name}`}>
              <div className="grid">
                {data.latestNews.map((news, index) => (
                  <NewsCard
                    key={news._id}
                    date={getEffectiveDate(news)}
                    slug={news.slug?.current || ""}
                    title={news.title || ""}
                    isLast={index === data.latestNews.length - 1}
                    excerpt={news.excerpt || ""}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Local Politicians Section */}
          {sortedPoliticians.length > 0 && (
            <Section title="Dina lokala politiker">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sortedPoliticians.map((politician) => (
                  <PeopleCard
                    key={politician._id}
                    name={politician.name}
                    image={politician.image}
                    slug={politician.slug?.current || ""}
                    size="large"
                  />
                ))}
              </div>
            </Section>
          )}
        </div>
      </main>
    </div>
  );
}
