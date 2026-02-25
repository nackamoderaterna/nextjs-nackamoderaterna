import { GeographicalAreaCard } from "@/lib/components/politics/geographicalAreaCard";
import { PoliticalAreaCard } from "@/lib/components/politics/politicalAreaCard";
import { PoliticalIssueItem } from "@/lib/components/politics/PoliticalIssueItem";
import { PoliticalArea, PoliticalIssue, GeographicalArea } from "~/sanity.types";
import { politikPageQuery } from "@/lib/queries/politik";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import { generateMetadata as buildMetadata, getGlobalSeoDefaults } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ROUTE_BASE } from "@/lib/routes";
import { buildBreadcrumbJsonLd } from "@/lib/utils/breadcrumbJsonLd";
import { ListingPageLayout } from "@/lib/components/shared/ListingPageLayout";
import { ResponsiveGrid } from "@/lib/components/shared/ResponsiveGrid";
import { Section } from "@/lib/components/shared/Section";
import type { ListingPage } from "@/lib/types/pages";
import { Button } from "@/lib/components/ui/button";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const [listing, defaults] = await Promise.all([
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "politics" },
      { next: { revalidate: 86400, tags: ["listing-pages"] } }
    ),
    getGlobalSeoDefaults(),
  ]);

  const title =
    listing?.seo?.title ||
    listing?.title ||
    "Vår politik | Nackamoderaterna";
  const description =
    listing?.seo?.description ||
    "Läs mer om vår politik och våra ståndpunkter i olika frågor";

  return buildMetadata({
    title,
    description,
    image: listing?.seo?.image?.url ?? defaults.image,
    url: ROUTE_BASE.POLITICS,
  });
}

export const revalidate = 86400;

export type PoliticalIssueWithAreas = Omit<
  PoliticalIssue,
  "politicalAreas" | "geographicalAreas"
> & {
  description?: string | null;
  fulfilled?: boolean;
  slug?: { current?: string } | null;
  politicalAreas: Array<{
    _id: string;
    name: string;
    slug: { current: string };
  }>;
  geographicalAreas?: Array<{
    _id: string;
    name: string;
    slug: { current: string };
  }>;
};

export type PoliticalIssuesPageData = {
  featuredPoliticalIssues: PoliticalIssueWithAreas[];
  fulfilledPoliticalIssues: PoliticalIssueWithAreas[];
  politicalAreas: Array<
    Omit<PoliticalArea, "icon"> & {
      icon?: {
        name?: string;
      };
    }
  >;
  geographicalAreas: GeographicalArea[];
};

export default async function PoliticsPage() {
  const [data, listing] = await Promise.all([
    sanityClient.fetch<PoliticalIssuesPageData>(
      politikPageQuery,
      {},
      {
        next: { revalidate: 86400, tags: ["politics"] },
      }
    ),
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "politics" },
      {
        next: { revalidate: 86400, tags: ["listing-pages"] },
      }
    ),
  ]);
  // Section titles from CMS with fallbacks
  const titles = {
    featured: listing?.sectionTitles?.featuredIssues || "Kärnfrågor",
    categories: listing?.sectionTitles?.categories || "Kategorier",
    areas: listing?.sectionTitles?.areas || "Områden",
    fulfilled: listing?.sectionTitles?.fulfilledPromises || "Uppfyllda vallöften",
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Hem", url: "/" },
    { name: "Politik" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="bg-background">
      <ListingPageLayout
        title={listing?.title}
        intro={listing?.intro}
        fallbackTitle="Vår politik"
      >
          {/* Key Issues Section */}
          <Section title={titles.featured} titleSize="large" actions={<Button asChild variant="link" size="sm"><Link href={`${ROUTE_BASE.POLITICS_ISSUES}`}>Se alla</Link></Button>}>
            <ResponsiveGrid cols={3}>
              {data.featuredPoliticalIssues.map((issue) => (
                <PoliticalIssueItem
                  key={issue._id}
                  title={issue.question || ""}
                  description={issue.description}
                  politicalAreas={issue.politicalAreas}
                  geographicalAreas={issue.geographicalAreas ?? []}
                  issueSlug={issue.slug?.current}

                />
              ))}
            </ResponsiveGrid>
          </Section>

        {/* Political Areas Grid */}
        <Section title={titles.categories} titleSize="large">
          <ResponsiveGrid cols={4} colsBase={2}>
            {data.politicalAreas.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "sv")).map((area) => {
              const Icon = getLucideIcon(area.icon?.name);
              return (
                <PoliticalAreaCard
                  key={area._id}
                  title={area.name || ""}
                  href={`${ROUTE_BASE.POLITICS_CATEGORY}/${area.slug?.current}`}
                  icon={Icon || undefined}
                />
              );
            })}
          </ResponsiveGrid>
        </Section>

        {/* Geographical Areas (Områden) */}
        {data.geographicalAreas?.length > 0 && (
          <Section title={titles.areas} titleSize="large">
            <ResponsiveGrid cols={3}>
              {data.geographicalAreas
                .filter((area) => area.slug?.current)
                .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "sv"))
                .map((area) => (
                  <GeographicalAreaCard
                    key={area._id}
                    title={area.name || ""}
                    image={area.image}
                    slug={area.slug!.current!}
                  />
                ))}
            </ResponsiveGrid>
          </Section>
        )}

        {/* Fulfilled Promises Section */}
        {data.fulfilledPoliticalIssues.length > 0 && (
          <Section title={titles.fulfilled} titleSize="large">
            <ResponsiveGrid cols={3}>
              {data.fulfilledPoliticalIssues.map((issue) => (
                <PoliticalIssueItem
                  key={issue._id}
                  title={issue.question || ""}
                  description={issue.description}
                  politicalAreas={issue.politicalAreas}
                  geographicalAreas={issue.geographicalAreas ?? []}
                  issueSlug={issue.slug?.current}
                  fulfilled
                />
              ))}
            </ResponsiveGrid>
          </Section>
        )}
      </ListingPageLayout>
    </div>
    </>
  );
}
