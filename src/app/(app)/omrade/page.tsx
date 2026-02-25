import { GeographicalAreaCard } from "@/lib/components/politics/geographicalAreaCard";
import { politikPageQuery } from "@/lib/queries/politik";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { generateMetadata as buildMetadata, getGlobalSeoDefaults } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ROUTE_BASE } from "@/lib/routes";
import { buildBreadcrumbJsonLd } from "@/lib/utils/breadcrumbJsonLd";
import { ResponsiveGrid } from "@/lib/components/shared/ResponsiveGrid";
import { Section } from "@/lib/components/shared/Section";
import { ListingPageLayout } from "@/lib/components/shared/ListingPageLayout";
import { GeographicalArea } from "~/sanity.types";
import type { ListingPage } from "@/lib/types/pages";

export async function generateMetadata(): Promise<Metadata> {
  const [listing, defaults] = await Promise.all([
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "politikOmrade" },
      { next: { revalidate: 86400, tags: ["listing-pages"] } }
    ),
    getGlobalSeoDefaults(),
  ]);

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
    image: listing?.seo?.image?.url ?? defaults.image,
    url: ROUTE_BASE.AREAS,
  });
}

export const revalidate = 86400;

type PoliticsPageData = {
  geographicalAreas: GeographicalArea[];
};

export default async function OmradePage() {
  const [data, listing] = await Promise.all([
    sanityClient.fetch<PoliticsPageData>(politikPageQuery, {}, {
      next: { revalidate: 86400, tags: ["politics"] },
    }),
    sanityClient.fetch<ListingPage>(listingPageByKeyQuery, { key: "politikOmrade" }, {
      next: { revalidate: 86400, tags: ["listing-pages"] },
    }),
  ]);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Hem", url: "/" },
    { name: "Områden" },
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
        fallbackTitle="Geografiska områden"
      >
        <Section>
          <ResponsiveGrid cols={2}>
            {data.geographicalAreas.map((area) => (
              <GeographicalAreaCard
                key={area._id}
                title={area.name || ""}
                image={area.image}
                slug={area.slug?.current || ""}
              />
            ))}
          </ResponsiveGrid>
        </Section>
      </ListingPageLayout>
    </div>
    </>
  );
}
