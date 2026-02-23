import { PoliticalAreaCard } from "@/lib/components/politics/politicalAreaCard";
import { politikPageQuery } from "@/lib/queries/politik";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import { generateMetadata as buildMetadata, getGlobalSeoDefaults } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ROUTE_BASE } from "@/lib/routes";
import { ResponsiveGrid } from "@/lib/components/shared/ResponsiveGrid";
import { Section } from "@/lib/components/shared/Section";
import { ListingPageLayout } from "@/lib/components/shared/ListingPageLayout";
import { PoliticalArea } from "~/sanity.types";
import type { ListingPage } from "@/lib/types/pages";

export async function generateMetadata(): Promise<Metadata> {
  const [listing, defaults] = await Promise.all([
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "politikKategori" },
      { next: { revalidate: 86400 } }
    ),
    getGlobalSeoDefaults(),
  ]);

  const title =
    listing?.seo?.title ||
    listing?.title ||
    "Politiska kategorier | Nackamoderaterna";
  const description =
    listing?.seo?.description ||
    "Läs mer om våra politiska områden och kategorier som ekonomi, vård, klimat och miljö.";

  return buildMetadata({
    title,
    description,
    image: listing?.seo?.image?.url ?? defaults.image,
    url: ROUTE_BASE.POLITICS_CATEGORY,
  });
}

export const revalidate = 86400;

type PoliticsPageData = {
  politicalAreas: Array<
    Omit<PoliticalArea, "icon"> & {
      icon?: {
        name?: string;
      };
    }
  >;
};

export default async function PolitikKategoriPage() {
  const [data, listing] = await Promise.all([
    sanityClient.fetch<PoliticsPageData>(politikPageQuery, {}, {
      next: { revalidate: 86400 },
    }),
    sanityClient.fetch<ListingPage>(listingPageByKeyQuery, { key: "politikKategori" }, {
      next: { revalidate: 86400 },
    }),
  ]);

  return (
    <div className="bg-background">
      <ListingPageLayout
        title={listing?.title}
        intro={listing?.intro}
        fallbackTitle="Politiska kategorier"
      >
        <Section>
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
      </ListingPageLayout>
    </div>
  );
}
