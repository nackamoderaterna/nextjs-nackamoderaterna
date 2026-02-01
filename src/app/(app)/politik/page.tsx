import { PoliticalAreaCard } from "@/lib/components/politics/politicalAreaCard";
import { KeyIssueCard } from "@/lib/components/politics/keyIssueCard";
import { PoliticalArea, PoliticalIssue } from "~/sanity.types";
import { politikPageQuery } from "@/lib/queries/politik";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ROUTE_BASE } from "@/lib/routes";
import { ListingHeader } from "@/lib/components/shared/ListingHeader";
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
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <ListingHeader
          title={listing?.title}
          intro={listing?.intro}
          fallbackTitle="Vår politik"
        />

          {/* Key Issues Section */}
          <Section title="Våra kärnfrågor" titleSize="large">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.featuredPoliticalIssues.map((issue) => (
                <KeyIssueCard
                  key={issue._id}
                  title={issue.question || ""}
                  politicalAreas={issue.politicalAreas}
                  geographicalAreas={issue.geographicalAreas ?? []}
                  issueSlug={issue.slug?.current}
                />
              ))}
            </div>
          </Section>

        {/* Political Areas Grid */}
        <Section title="Kategorier" titleSize="large">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          </div>
        </Section>

        {/* Fulfilled Promises Section */}
        {data.fulfilledPoliticalIssues.length > 0 && (
          <Section title="Uppfyllda vallöften" titleSize="large">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.fulfilledPoliticalIssues.map((issue) => (
                <KeyIssueCard
                  key={issue._id}
                  title={issue.question || ""}
                  politicalAreas={issue.politicalAreas}
                  geographicalAreas={issue.geographicalAreas ?? []}
                  issueSlug={issue.slug?.current}
                  fulfilled
                />
              ))}
            </div>
          </Section>
        )}
      </main>
    </div>
  );
}
