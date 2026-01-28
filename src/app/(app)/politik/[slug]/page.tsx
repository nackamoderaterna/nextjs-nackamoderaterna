import { Button } from "@/components/ui/button";
import { NewsCard } from "@/lib/components/news/NewsCard";
import { PeopleCard } from "@/lib/components/politician/PeopleCard";
import { PolicyList } from "@/lib/components/politics/policyList";
import { PoliticalAreaHero } from "@/lib/components/politics/politicalAreaHero";
import { ContentWithSidebar } from "@/lib/components/shared/ContentWithSidebar";
import { politicalAreaPageQuery, allPoliticalAreaSlugsQuery } from "@/lib/queries/politik";
import { globalSettingsQuery } from "@/lib/queries/globalSettings";
import { sanityClient } from "@/lib/sanity/client";
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
  console.log(data.politicians);

  const mainContent = (
    <div className="space-y-8 prose md:prose-lg">
      <div className="prose md:prose-lg">
        {data.description && <PortableText value={data.description} components={portableTextComponents} />}
      </div>

      {globalSettings?.handlingsprogram?.url && (
        <Button 
          asChild
          className="mt-6 bg-brand-primary hover:bg-brand-primary/90 text-white"
        >
          <Link href={globalSettings.handlingsprogram.url} target="_blank" rel="noopener noreferrer" className="no-underline">
            Läs vårt handlingsprogram
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  );

  const sidebarContent = (
    <>
      <PolicyList title="Våra kärnfrågor" policies={data.politicalIssues} />
      {data.politicians.length > 0 && (
      <div className="grid gap-4 mt-8 bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-foreground">Företrädare</h2>
        {
          data.politicians.map((politician) => (
            <PeopleCard
              key={politician._id}
              slug={politician.slug?.current || ""}
              image={politician.image}
              name={politician.name || ""}
              size={"small"}
            />
          ))
        }
      </div>
        )}
    </>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PoliticalAreaHero image={data.image} title={data.name || ""} />

          <ContentWithSidebar
            mainContent={mainContent}
            sidebarContent={sidebarContent}
          />

          {/* Current News Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Aktuellt inom {data.name}
            </h2>
            <div className="grid">
              {data.latestNews.map((news, index) => (
                <NewsCard
                  date={getEffectiveDate(news)}
                  slug={news.slug?.current || ""}
                  title={news.title || ""}
                  isLast={index === data.latestNews.length - 1}
                  excerpt={news.excerpt || ""}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
