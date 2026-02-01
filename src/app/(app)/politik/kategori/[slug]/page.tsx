import { NewsCard } from "@/lib/components/news/NewsCard";
import { PeopleCard } from "@/lib/components/politician/PeopleCard";
import { PolicyList } from "@/lib/components/politics/policyList";
import { ContentHero } from "@/lib/components/shared/ContentHero";
import { ContentWithSidebar } from "@/lib/components/shared/ContentWithSidebar";
import { politicalAreaPageQuery, allPoliticalAreaSlugsQuery } from "@/lib/queries/politik";
import { globalSettingsQuery } from "@/lib/queries/globalSettings";
import { sanityClient } from "@/lib/sanity/client";
import { buildImageUrl } from "@/lib/sanity/image";
import { generateMetadata as generateSEOMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { groq } from "next-sanity";
import { ExternalLink } from "lucide-react";
import { PortableText } from "next-sanity";
import Link from "next/link";
import {
  News,
  PoliticalArea,
  PoliticalIssue,
  Politician,
} from "~/sanity.types";
import { portableTextComponents } from "@/lib/components/shared/PortableTextComponents";
import { getEffectiveDate } from "@/lib/utils/getEffectiveDate";
import { ROUTE_BASE } from "@/lib/routes";
import { Sidebar } from "@/lib/components/shared/Sidebar";
import { Section } from "@/lib/components/shared/Section";
import { Button } from "@/lib/components/ui/button";

// Generate static params for all political areas at build time
export async function generateStaticParams() {
  const areas = await sanityClient.fetch<{ slug: string }[]>(
    allPoliticalAreaSlugsQuery
  );
  
  return areas.map((area) => ({
    slug: area.slug,
  }));
}

export type PoliticalAreaPage = Omit<PoliticalArea, never> & {
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
  const data = await sanityClient.fetch<PoliticalAreaPage>(
    politicalAreaPageQuery,
    { slug, areaId: "" }
  );

  if (!data) {
    return generateSEOMetadata({
      title: "Politiskt område hittades inte",
      description: "Det begärda politiska området kunde inte hittas",
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
    url: `${ROUTE_BASE.POLITICS_CATEGORY}/${slug}`,
  });
}

export const revalidate = 300;

export default async function PoliticalAreaSinglePage({ params }: Props) {
  const { slug } = await params;
  // First get the political area to get its ID for the politician query
  const area = await sanityClient.fetch<{ _id: string } | null>(
    groq`*[_type == "politicalArea" && slug.current == $slug][0] { _id }`,
    { slug }
  );
  const data = await sanityClient.fetch<PoliticalAreaPage>(
    politicalAreaPageQuery,
    { slug, areaId: area?._id || "" },
  );
  const globalSettings = await sanityClient.fetch(globalSettingsQuery);


  const newsSection = data.latestNews?.length > 0 && (
    <Section title={`Aktuellt inom ${data.name}`} actions={
      <Link
          href={`${ROUTE_BASE.NEWS}?area=${data._id}`}
          className="shrink-0 text-sm font-medium text-primary hover:underline flex items-center gap-1"
        >
          Alla nyheter
          <ExternalLink className="h-4 w-4" />
        </Link>
    }>
  
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
  );

  const mainContent = (
    <div className="space-y-8">
      <div className="prose md:prose-lg max-w-none">
      
        {data.description && (
          <PortableText value={data.description} components={portableTextComponents} />
        )}
      </div>
    </div>
  );

  const sidebarContent = (
    <div className="grid gap-4">
     
      {data.politicalIssues.length > 0 && (
        <Sidebar heading="Politiska mål">
          <PolicyList policies={data.politicalIssues} />
        </Sidebar>
      )}
      {data.politicians.length > 0 && (
        <Sidebar heading="Företrädare">
          {data.politicians.map((politician) => (
            <PeopleCard
              key={politician._id}
              slug={politician.slug?.current || ""}
              image={politician.image}
              name={politician.name || ""}
              size="small"
            />
          ))}
        </Sidebar>
      )}
       {globalSettings?.handlingsprogram?.url && (
        <Button
          asChild
          variant="outline"
          className="w-full"
          size="lg"
        >
          <div className="flex items-center gap-2">
          <Link href={globalSettings.handlingsprogram.url} target="_blank" rel="noopener noreferrer">
            Läs vårt handlingsprogram
          </Link>
          <ExternalLink className="h-4 w-4" />
          </div>
        </Button>
       
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ContentHero icon={data.icon} title={data.name || ""} />

          <ContentWithSidebar
            mainContent={mainContent}
            sidebarContent={sidebarContent}
            className="pb-12 border-b border-border"
          />

        {newsSection}
        </div>
      </main>
    </div>
  );
}
