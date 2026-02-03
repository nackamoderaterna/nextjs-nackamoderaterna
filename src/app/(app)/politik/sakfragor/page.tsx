import { PoliticalIssueItem } from "@/lib/components/politics/PoliticalIssueItem";
import { allPoliticalIssuesQuery } from "@/lib/queries/politik";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ROUTE_BASE } from "@/lib/routes";
import { ResponsiveGrid } from "@/lib/components/shared/ResponsiveGrid";
import { ListingPageLayout } from "@/lib/components/shared/ListingPageLayout";
import { Section } from "@/lib/components/shared/Section";
import { PoliticalIssue } from "~/sanity.types";
import type { ListingPage } from "@/lib/types/pages";

export async function generateMetadata(): Promise<Metadata> {
  const listing = await sanityClient.fetch<ListingPage>(
    listingPageByKeyQuery,
    { key: "politikSakfragor" }
  );

  const title =
    listing?.seo?.title ||
    listing?.title ||
    "Våra sakfrågor | Nackamoderaterna";
  const description =
    listing?.seo?.description ||
    "Läs mer om våra kärnfrågor och uppfyllda vallöften inom Nacka.";

  return buildMetadata({
    title,
    description,
    url: ROUTE_BASE.POLITICS_ISSUES,
  });
}

export const revalidate = 3600;

type PoliticalIssueWithAreas = Omit<
  PoliticalIssue,
  "politicalAreas" | "geographicalAreas"
> & {
  description?: string | null;
  fulfilled?: boolean;
  slug?: { current: string } | null;
  politicalAreas: Array<{
    _id: string;
    name: string;
    slug: { current: string };
    icon?: { name?: string } | null;
  }>;
  geographicalAreas?: Array<{
    _id: string;
    name: string;
    slug: { current: string };
  }>;
};

export default async function PolitikSakfragorPage() {
  const [allIssues, listing] = await Promise.all([
    sanityClient.fetch<PoliticalIssueWithAreas[]>(allPoliticalIssuesQuery, {}, {
      next: { revalidate: 3600 },
    }),
    sanityClient.fetch<ListingPage>(listingPageByKeyQuery, { key: "politikSakfragor" }, {
      next: { revalidate: 3600 },
    }),
  ]);

  // Section titles from CMS with fallbacks
  const titles = {
    featured: listing?.sectionTitles?.sakfragorFeatured || "Kärnfrågor",
    fulfilled: listing?.sectionTitles?.sakfragorFulfilled || "Genomförda vallöften",
    all: listing?.sectionTitles?.sakfragorAll || "Sakfrågor",
  };

  // Group issues
  const featuredIssues = allIssues.filter((i) => i.featured && !i.fulfilled);
  const fulfilledIssues = allIssues.filter((i) => i.fulfilled);
  const otherIssues = allIssues.filter((i) => !i.featured && !i.fulfilled);

  return (
    <div className="bg-background">
      <ListingPageLayout
        title={listing?.title}
        intro={listing?.intro}
        fallbackTitle="Våra sakfrågor"
      >
        {/* Kärnfrågor */}
        {featuredIssues.length > 0 && (
          <Section title={titles.featured} titleSize="large">
            <ResponsiveGrid cols={3}>
              {featuredIssues.map((issue) => (
                <PoliticalIssueItem
                  key={issue._id}
                  title={issue.question || ""}
                  description={issue.description}
                  politicalAreas={issue.politicalAreas}
                  geographicalAreas={issue.geographicalAreas ?? []}
                  issueSlug={issue.slug?.current}
                  featured
                />
              ))}
            </ResponsiveGrid>
          </Section>
        )}

        {/* Genomförda vallöften */}
        {fulfilledIssues.length > 0 && (
          <Section title={titles.fulfilled} titleSize="large">
            <ResponsiveGrid cols={3}>
              {fulfilledIssues.map((issue) => (
                <PoliticalIssueItem
                  key={issue._id}
                  title={issue.question || ""}
                  description={issue.description}
                  politicalAreas={issue.politicalAreas}
                  geographicalAreas={issue.geographicalAreas ?? []}
                  issueSlug={issue.slug?.current}
                  fulfilled
                  featured={!!issue.featured}
                />
              ))}
            </ResponsiveGrid>
          </Section>
        )}

        {/* Sakfrågor */}
        {otherIssues.length > 0 && (
          <Section title={titles.all} titleSize="large">
            <ResponsiveGrid cols={3}>
              {otherIssues.map((issue) => (
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
        )}
      </ListingPageLayout>
    </div>
  );
}
