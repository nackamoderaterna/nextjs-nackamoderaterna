import { PoliticalAreaCard } from "@/lib/components/politics/politicalAreaCard";
import { politikPageQuery } from "@/lib/queries/politik";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ROUTE_BASE } from "@/lib/routes";
import { Section } from "@/lib/components/shared/Section";
import { ListingHeader } from "@/lib/components/shared/ListingHeader";
import { PoliticalArea } from "~/sanity.types";
import type { ListingPage } from "@/lib/types/pages";

export async function generateMetadata(): Promise<Metadata> {
  const listing = await sanityClient.fetch<ListingPage>(
    listingPageByKeyQuery,
    { key: "politikKategori" }
  );

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
    url: ROUTE_BASE.POLITICS_CATEGORY,
  });
}

export const revalidate = 300;

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
      next: { revalidate: 300 },
    }),
    sanityClient.fetch<ListingPage>(listingPageByKeyQuery, { key: "politikKategori" }, {
      next: { revalidate: 300 },
    }),
  ]);

  return (
    <div className="bg-background">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ListingHeader
          title={listing?.title}
          intro={listing?.intro}
          fallbackTitle="Politiska kategorier"
        />
        <Section>
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
      </main>
    </div>
  );
}
