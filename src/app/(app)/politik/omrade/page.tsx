import { GeographicalAreaCard } from "@/lib/components/politics/geographicalAreaCard";
import { politikPageQuery } from "@/lib/queries/politik";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ROUTE_BASE } from "@/lib/routes";
import { Section } from "@/lib/components/shared/Section";
import { ListingHeader } from "@/lib/components/shared/ListingHeader";
import { GeographicalArea } from "~/sanity.types";
import type { ListingPage } from "@/lib/types/pages";

export async function generateMetadata(): Promise<Metadata> {
  const listing = await sanityClient.fetch<ListingPage>(
    listingPageByKeyQuery,
    { key: "politikOmrade" }
  );

  const title =
    listing?.seo?.title ||
    listing?.title ||
    "Geografiska områden | Nackamoderaterna";
  const description =
    listing?.seo?.description ||
    "Läs mer om våra geografiska områden och vad vi gör för din del av Nacka.";

  return buildMetadata({
    title,
    description,
    url: ROUTE_BASE.POLITICS_AREA,
  });
}

export const revalidate = 300;

type PoliticsPageData = {
  geographicalAreas: GeographicalArea[];
};

export default async function PolitikOmradePage() {
  const [data, listing] = await Promise.all([
    sanityClient.fetch<PoliticsPageData>(politikPageQuery, {}, {
      next: { revalidate: 300 },
    }),
    sanityClient.fetch<ListingPage>(listingPageByKeyQuery, { key: "politikOmrade" }, {
      next: { revalidate: 300 },
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ListingHeader
          title={listing?.title}
          intro={listing?.intro}
          fallbackTitle="Geografiska områden"
        />
        <Section>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.geographicalAreas.map((area) => (
              <GeographicalAreaCard
                key={area._id}
                title={area.name || ""}
                image={area.image}
                slug={area.slug?.current || ""}
              />
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}
