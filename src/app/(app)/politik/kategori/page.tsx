import { PoliticalAreaCard } from "@/lib/components/politics/politicalAreaCard";
import { politikPageQuery } from "@/lib/queries/politik";
import { sanityClient } from "@/lib/sanity/client";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ROUTE_BASE } from "@/lib/routes";
import { Section } from "@/lib/components/shared/Section";
import { PoliticalArea } from "~/sanity.types";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Politiska kategorier | Nackamoderaterna",
    description:
      "Läs mer om våra politiska områden och kategorier som ekonomi, vård, klimat och miljö.",
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
  const data = await sanityClient.fetch<PoliticsPageData>(politikPageQuery, {}, {
    next: { revalidate: 300 },
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Section title="Politiska kategorier" titleSize="large">
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
