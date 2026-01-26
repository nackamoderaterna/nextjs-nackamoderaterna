import { Button } from "@/components/ui/button";
import { NewsCard } from "@/lib/components/news/NewsCard";
import { PeopleCard } from "@/lib/components/politician/PoliticianCardLarge";
import { PolicyList } from "@/lib/components/politics/policyList";
import { PoliticalAreaHero } from "@/lib/components/politics/politicalAreaHero";
import { ContentWithSidebar } from "@/lib/components/shared/ContentWithSidebar";
import { politicalAreaPageQuery } from "@/lib/queries/politik";
import { sanityClient } from "@/lib/sanity/client";
import { formatDate } from "@/lib/utils/dateUtils";
import { ExternalLink } from "lucide-react";
import { PortableText } from "next-sanity";
import {
  News,
  PoliticalArea,
  PoliticalIssue,
  Politician,
} from "~/sanity.types";

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
  const data = await sanityClient.fetch<PoliticalAreaPage>(
    politicalAreaPageQuery,
    { slug },
  );

  const mainContent = (
    <div className="space-y-8 prose md:prose-lg">
      <div className="prose md:prose-lg">
        {data.description && <PortableText value={data.description} />}
      </div>

      <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white">
        Läs vårt handlingsprogram
        <ExternalLink className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  const sidebarContent = (
    <>
      <PolicyList title="Moderaterna vill" policies={data.politicalIssues} />
      {data.politicians.length > 0 && (
      <div className="grid gap-4 mt-8 bg-card border border-border rounded-lg p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Företrädare</h2>
        {
          data.politicians.map((politician) => (
            <PeopleCard
              key={politician._id}
              slug={politician.slug?.current || ""}
              image={politician.image}
              title={politician.name || ""}
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

          {/* People Section */}
          <section></section>
        </div>
      </main>
    </div>
  );
}

// <PeopleCard
//   size="large"
//   image="/professional-woman-headshot.png"
//   name="Disa Påhlman Nilsson"
//   title="Biträdande kommunalråd"
// />
// <PeopleCard
//   size="large"
//   image="/professional-woman-headshot.png"
//   name="Disa Påhlman Nilsson"
//   title="Biträdande kommunalråd"
// />
// <PeopleCard
//   size="large"
//   image="/professional-woman-headshot.png"
//   name="Disa Påhlman Nilsson"
//   title="Biträdande kommunalråd"
// />
// <PeopleCard
//   size="large"
//   image="/professional-woman-headshot.png"
//   name="Disa Påhlman Nilsson"
//   title="Biträdande kommunalråd"
// />
