import { PoliticalAreaCard } from "@/lib/components/politics/politicalAreaCard";
import { PoliticalIssueItem } from "@/lib/components/politics/PoliticalIssueItem";
import { PoliticalArea, PoliticalIssue } from "~/sanity.types";
import { politikPageQuery } from "@/lib/queries/politik";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ROUTE_BASE } from "@/lib/routes";
import { ListingPageLayout } from "@/lib/components/shared/ListingPageLayout";
import { ResponsiveGrid } from "@/lib/components/shared/ResponsiveGrid";
import { Section } from "@/lib/components/shared/Section";
import type { ListingPage } from "@/lib/types/pages";

export async function generateMetadata(): Promise<Metadata> {
  const listing = await sanityClient.fetch<ListingPage>(
    listingPageByKeyQuery,
    { key: "politics" }
  );

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
    url: ROUTE_BASE.POLITICS,
  });
}

export const revalidate = 300;

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
};

export default async function PoliticsPage() {
  const [data, listing] = await Promise.all([
    sanityClient.fetch<PoliticalIssuesPageData>(
      politikPageQuery,
      {},
      {
        next: { revalidate: 300 },
      }
    ),
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "politics" },
      {
        next: { revalidate: 300 },
      }
    ),
  ]);
  return (
    <div className="bg-background">
      <ListingPageLayout
        title={listing?.title}
        intro={listing?.intro}
        fallbackTitle="Vår politik"
      >
          {/* Key Issues Section */}
          <Section title="Våra kärnfrågor" titleSize="large">
            <ResponsiveGrid cols={2}>
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
        <Section title="Kategorier" titleSize="large">
          <ResponsiveGrid cols={4} colsBase={2}>
            {data.politicalAreas.map((area) => {
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

        {/* Fulfilled Promises Section */}
        {data.fulfilledPoliticalIssues.length > 0 && (
          <Section title="Uppfyllda vallöften" titleSize="large">
            <ResponsiveGrid cols={2}>
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
  );
}
