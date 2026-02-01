import { KeyIssueCard } from "@/lib/components/politics/keyIssueCard";
import { politikPageQuery } from "@/lib/queries/politik";
import { sanityClient } from "@/lib/sanity/client";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ROUTE_BASE } from "@/lib/routes";
import { Section } from "@/lib/components/shared/Section";
import { PoliticalIssue } from "~/sanity.types";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Våra sakfrågor | Nackamoderaterna",
    description:
      "Läs mer om våra kärnfrågor och uppfyllda vallöften inom Nacka.",
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
    slug: {
      current: string;
    };
  }>;

  geographicalAreas?: Array<{
    _id: string;
    name: string;
    image: unknown;
    slug: {
      current: string;
    };
  }>;
};

type PoliticsPageData = {
  featuredPoliticalIssues: PoliticalIssueWithAreas[];
  fulfilledPoliticalIssues: PoliticalIssueWithAreas[];
};

export default async function PolitikSakfragorPage() {
  const data = await sanityClient.fetch<PoliticsPageData>(politikPageQuery, {}, {
    next: { revalidate: 300 },
  });

  const hasFeatured = data.featuredPoliticalIssues.length > 0;
  const hasFulfilled = data.fulfilledPoliticalIssues.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {hasFeatured && (
          <Section title="Våra kärnfrågor" titleSize="large">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.featuredPoliticalIssues.map((issue) => (
                <KeyIssueCard
                  key={issue._id}
                  title={issue.question || ""}
                  relatedArea={issue.politicalAreas[0]?.name || ""}
                  slug={issue.politicalAreas[0]?.slug?.current || ""}
                  issueSlug={issue.slug?.current}
                />
              ))}
            </div>
          </Section>
        )}

        {hasFulfilled && (
          <Section title="Uppfyllda vallöften" titleSize="large">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.fulfilledPoliticalIssues.map((issue) => (
                <KeyIssueCard
                  key={issue._id}
                  title={issue.question || ""}
                  relatedArea={issue.politicalAreas?.[0]?.name || ""}
                  slug={issue.politicalAreas?.[0]?.slug?.current || ""}
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
