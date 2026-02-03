import { NewsCard } from "@/lib/components/news/NewsCard";
import { SidebarList, SidebarListItem } from "@/lib/components/shared/SidebarList";
import { cleanInvisibleUnicode } from "@/lib/politicians";
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
import { PageContainer } from "@/lib/components/shared/PageContainer";
import { SetBreadcrumbTitle } from "@/lib/components/shared/BreadcrumbTitleContext";
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

  const firstBlock = data.description?.find(
    (b): b is typeof b & { children: { text?: string }[] } =>
      "children" in b && Array.isArray(b.children)
  );
  const descriptionText = firstBlock?.children?.[0]?.text?.substring(0, 150);

  return generateSEOMetadata({
    title: `${data.name} | Nackamoderaterna`,
    description: descriptionText
      ? `${data.name} - ${descriptionText}...`
      : `Läs mer om ${data.name}`,
    image: imageUrl,
    url: `${ROUTE_BASE.POLITICS_CATEGORY}/${slug}`,
  });
}

export const revalidate = 3600;

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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
     
      {data.politicalIssues.length > 0 && (
        <Sidebar heading="Politiska mål">
          <PolicyList policies={data.politicalIssues} />
        </Sidebar>
      )}
      {data.politicians.length > 0 && (
        <Sidebar heading="Företrädare">
          <SidebarList>
            {data.politicians.map((politician) => (
              <SidebarListItem
                key={politician._id}
                title={cleanInvisibleUnicode(politician.name?.trim() || "Namn saknas")}
                image={politician.image}
                href={`${ROUTE_BASE.POLITICIANS}/${politician.slug?.current || ""}`}
              />
            ))}
          </SidebarList>
        </Sidebar>
      )}
       {globalSettings?.handlingsprogram?.url && (
        <Button
          asChild
          variant="outline"
          className="w-full"
          size="lg"
        >
          <div className="flex items-center gap-2 max-w-sm">
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
    <div className="bg-background flex flex-col">
      <main className="flex-1">
        <PageContainer paddingY="default">
          <SetBreadcrumbTitle title={data.name || ""} />
          <ContentHero pageType="Kategori" icon={data.icon} title={data.name || ""} />

          <ContentWithSidebar
            mainContent={mainContent}
            sidebarContent={sidebarContent}
            className="pb-12 border-b border-border"
          />

        {newsSection}
        </PageContainer>
      </main>
    </div>
  );
}
