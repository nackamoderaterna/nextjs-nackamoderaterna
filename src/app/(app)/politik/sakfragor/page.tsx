import { PoliticalIssuesViewSwitcher } from "@/lib/components/politics/political-issues-table/PoliticalIssuesViewSwitcher";
import { allPoliticalIssuesQuery } from "@/lib/queries/politik";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ROUTE_BASE } from "@/lib/routes";
import { ListingPageLayout } from "@/lib/components/shared/ListingPageLayout";
import { Section } from "@/lib/components/shared/Section";
import type { ListingPage } from "@/lib/types/pages";
import type { PoliticalIssueWithAreas } from "@/lib/components/politics/political-issues-table/types";

export async function generateMetadata(): Promise<Metadata> {
  const listing = await sanityClient.fetch<ListingPage>(
    listingPageByKeyQuery,
    { key: "politikSakfragor" },
    { next: { revalidate: 86400 } }
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

export const revalidate = 86400;

export default async function PolitikSakfragorPage() {
  const [allIssues, listing] = await Promise.all([
    sanityClient.fetch<PoliticalIssueWithAreas[]>(allPoliticalIssuesQuery, {}, {
      next: { revalidate: 86400 },
    }),
    sanityClient.fetch<ListingPage>(listingPageByKeyQuery, { key: "politikSakfragor" }, {
      next: { revalidate: 86400 },
    }),
  ]);

  // Section title from CMS with fallback
  const title = listing?.sectionTitles?.sakfragorAll || "Alla sakfrågor";

  return (
    <div className="bg-background">
      <ListingPageLayout
        title={listing?.title}
        intro={listing?.intro}
        fallbackTitle="Våra sakfrågor"
      >
        {allIssues.length > 0 && (
          <Section title={title} titleSize="large">
            <PoliticalIssuesViewSwitcher data={allIssues} />
          </Section>
        )}
      </ListingPageLayout>
    </div>
  );
}
