import { GeographicalAreaCard } from "@/lib/components/politics/geographicalAreaCard";
import { politikPageQuery } from "@/lib/queries/politik";
import { sanityClient } from "@/lib/sanity/client";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ROUTE_BASE } from "@/lib/routes";
import { Section } from "@/lib/components/shared/Section";
import { GeographicalArea } from "~/sanity.types";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Geografiska områden | Nackamoderaterna",
    description:
      "Läs mer om våra geografiska områden och vad vi gör för din del av Nacka.",
    url: ROUTE_BASE.POLITICS_AREA,
  });
}

export const revalidate = 300;

type PoliticsPageData = {
  geographicalAreas: GeographicalArea[];
};

export default async function PolitikOmradePage() {
  const data = await sanityClient.fetch<PoliticsPageData>(politikPageQuery, {}, {
    next: { revalidate: 300 },
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Section title="Geografiska områden" titleSize="large">
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
