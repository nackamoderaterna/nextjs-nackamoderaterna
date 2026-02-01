import { KeyIssueCard } from "@/lib/components/politics/keyIssueCard";
import { allPoliticalIssuesQuery } from "@/lib/queries/politik";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ROUTE_BASE } from "@/lib/routes";
import { Section } from "@/lib/components/shared/Section";
import { ListingHeader } from "@/lib/components/shared/ListingHeader";
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

export const revalidate = 300;

type PoliticalIssueWithAreas = Omit<
  PoliticalIssue,
  "politicalAreas" | "geographicalAreas"
> & {
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
      next: { revalidate: 300 },
    }),
    sanityClient.fetch<ListingPage>(listingPageByKeyQuery, { key: "politikSakfragor" }, {
      next: { revalidate: 300 },
    }),
  ]);

  const featuredIssues = allIssues.filter((i) => i.featured);
  const fulfilledIssues = allIssues.filter((i) => i.fulfilled && !i.featured);
  const otherIssues = allIssues.filter((i) => !i.featured && !i.fulfilled);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ListingHeader
          title={listing?.title}
          intro={listing?.intro}
          fallbackTitle="Våra sakfrågor"
        />
        {featuredIssues.length > 0 && (
          <Section title="Våra kärnfrågor" titleSize="large">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {featuredIssues.map((issue) => (
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
        )}

        {fulfilledIssues.length > 0 && (
          <Section title="Uppfyllda vallöften" titleSize="large">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {fulfilledIssues.map((issue) => (
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

        {otherIssues.length > 0 && (
          <Section title="Övriga sakfrågor" titleSize="large">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {otherIssues.map((issue) => (
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
        )}
      </main>
    </div>
  );
}
