import { notFound } from "next/navigation";
import { NewsCard } from "@/lib/components/news/NewsCard";
import { PeopleCard } from "@/lib/components/politician/PeopleCard";
import { ContentHero } from "@/lib/components/shared/ContentHero";
import { ContentWithSidebar } from "@/lib/components/shared/ContentWithSidebar";
import { Section } from "@/lib/components/shared/Section";
import {
  politicalIssuePageQuery,
  allPoliticalIssueSlugsQuery,
} from "@/lib/queries/politik";
import { sanityClient } from "@/lib/sanity/client";
import { buildImageUrl } from "@/lib/sanity/image";
import { generateMetadata as generateSEOMetadata, getDefaultOgImage } from "@/lib/utils/seo";
import { Metadata } from "next";
import { PortableText } from "next-sanity";
import {
  News,
  PoliticalArea,
  PoliticalIssue,
  Politician,
} from "~/sanity.types";
import { portableTextComponents } from "@/lib/components/shared/PortableTextComponents";
import { ROUTE_BASE } from "@/lib/routes";
import { getEffectiveDate } from "@/lib/utils/getEffectiveDate";
import { Sidebar } from "@/lib/components/shared/Sidebar";
import { AreaList } from "@/lib/components/politics/AreaList";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ReactNode } from "react";

// Generate static params for all political issues at build time
export async function generateStaticParams() {
  const issues = await sanityClient.fetch<{ slug: string }[]>(
    allPoliticalIssueSlugsQuery
  );

  return issues.map((issue) => ({
    slug: issue.slug,
  }));
}

export type PoliticalIssuePage = Omit<
  PoliticalIssue,
  "politicalAreas" | "geographicalAreas" | "responsiblePoliticians"
> & {
  content?: Array<{ children?: Array<{ text?: string }> }>;
  fulfilledAt?: string | null;
  politicalAreas: Array<
    Pick<PoliticalArea, "_id" | "name" | "slug"> & {
      icon?: { name?: string } | null;
    }
  >;
  geographicalAreas?: Array<{
    _id: string;
    name: string;
    slug: { current: string };
    image: unknown;
  }>;
  responsiblePoliticians: Array<{
    _id: string;
    name?: string | null;
    slug?: { current?: string } | null;
    image?: unknown;
  }>;
  latestNews: News[];
};

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [data, fallbackImage] = await Promise.all([
    sanityClient.fetch<PoliticalIssuePage>(politicalIssuePageQuery, { slug }),
    getDefaultOgImage(),
  ]);

  if (!data) {
    return generateSEOMetadata({
      title: "Sakfråga hittades inte",
      description: "Den begärda sakfrågan kunde inte hittas",
    });
  }

  const firstGeoArea = data.geographicalAreas?.[0];
  const imageUrl =
    firstGeoArea?.image
      ? buildImageUrl(firstGeoArea.image, {
          width: 1200,
          height: 630,
        })
      : fallbackImage;

  const contentBlock = data.content?.[0] as { children?: Array<{ text?: string }> } | undefined;
  const description = contentBlock?.children?.[0]?.text
    ? `${data.question} - ${contentBlock.children[0].text.substring(0, 150)}...`
    : `Läs mer om ${data.question}`;

  return generateSEOMetadata({
    title: `${data.question} | Nackamoderaterna`,
    description,
    image: imageUrl ?? undefined,
    url: `${ROUTE_BASE.POLITICS_ISSUES}/${slug}`,
  });
}

export const revalidate = 300;

export default async function PoliticalIssueSinglePage({ params }: Props) {
  const { slug } = await params;
  const data = await sanityClient.fetch<PoliticalIssuePage>(
    politicalIssuePageQuery,
    { slug },
    {
      next: { revalidate: 300 },
    }
  );

  if (!data) {
    notFound();
  }


  const main =
    data.content && data.content.length > 0 ? (
      <div className="space-y-8 prose md:prose-lg">
        <div className="prose md:prose-lg">
          <PortableText
            value={data.content as Parameters<typeof PortableText>[0]["value"]}
            components={portableTextComponents}
          />
        </div>
      </div>
    ) : null;

  const sidebarItems: ReactNode[] = [];

  if (data.politicalAreas && data.politicalAreas.length > 0) {
    sidebarItems.push(
      <Sidebar key="category" heading="Tillhör kategori">
        <AreaList
          areas={data.politicalAreas}
          getHref={(slug) => `${ROUTE_BASE.POLITICS_CATEGORY}/${slug}`}
        />
      </Sidebar>
    );
  }

  if (data.geographicalAreas && data.geographicalAreas.length > 0) {
    sidebarItems.push(
      <Sidebar key="geographical" heading="Relaterade områden">
        <AreaList
          areas={data.geographicalAreas.map((a) => ({
            _id: a._id,
            name: a.name,
            slug: a.slug,
          }))}
          getHref={(slug) => `${ROUTE_BASE.POLITICS_AREA}/${slug}`}
        />
      </Sidebar>
    );
  }

  if (data.fulfilled && data.fulfilledAt) {
    sidebarItems.push(
      <Sidebar key="fulfilled" heading="Uppfylld">
        <p className="text-sm text-muted-foreground">
          Uppfyllt den{" "}
          {format(new Date(data.fulfilledAt), "d MMMM yyyy", { locale: sv })}
        </p>
      </Sidebar>
    );
  }

  const sidebar = (
    <div className="grid gap-4">
      {sidebarItems}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ContentHero title={data.question || ""} />

          <ContentWithSidebar
            mainContent={main}
            sidebarContent={sidebar}
          />

          {/* News Section */}
          {data.latestNews && data.latestNews.length > 0 && (
            <Section title={`Aktuellt om ${data.question}`}>
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

          {/* Responsible Politicians Section */}
          {data.responsiblePoliticians &&
            data.responsiblePoliticians.length > 0 && (
              <Section title="Ansvariga politiker">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(data.responsiblePoliticians as Array<{ _id: string; name?: string | null; slug?: { current?: string } | null; image?: unknown }>).map((politician) => (
                    <PeopleCard
                      key={politician._id}
                      name={politician.name ?? ""}
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
