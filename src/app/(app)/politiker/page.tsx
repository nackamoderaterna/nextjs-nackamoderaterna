import {
  groupPoliticiansByRole,
  politiciansDirectoryQuery,
  PoliticianWithNamnd,
  positionTitles,
  sectionTitles,
} from "@/lib/politicians";
import { sanityClient, REVALIDATE_TIME } from "@/lib/sanity/client";
import { PoliticianSection } from "@/lib/components/politician/PoliticianSection";
import { generateMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Våra politiker | Nackamoderaterna",
  description: "Läs mer om våra politiker och deras engagemang i Nacka",
  url: "/politiker",
});

export const dynamic = "force-dynamic";
export const revalidate = REVALIDATE_TIME;

export default async function PoliticiansPage() {
  const politicians = await sanityClient.fetch<PoliticianWithNamnd[]>(
    politiciansDirectoryQuery,
    {},
    {
      next: { revalidate: REVALIDATE_TIME },
    }
  );
  const grouped = groupPoliticiansByRole(politicians);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Våra politiker
        </h1>

        {(grouped.kommunalrad.president.length > 0 ||
          grouped.kommunalrad.ordinary.length > 0) && (
          <PoliticianSection
            title={sectionTitles.kommunalrad}
            politicians={[
              ...grouped.kommunalrad.president,
              ...grouped.kommunalrad.ordinary,
            ]}
            cardType="large"
            positionTitle={positionTitles.ordforande}
          />
        )}

        {(grouped.partyBoard.ordforande.length > 0 ||
          grouped.partyBoard.ledamot.length > 0) && (
          <>
            <PoliticianSection
              title={sectionTitles.partyBoard}
              politicians={grouped.partyBoard.ordforande}
              cardType="small"
              positionTitle={positionTitles.ordforande}
            />
            <PoliticianSection
              title=""
              politicians={grouped.partyBoard.ledamot}
              cardType="small"
              positionTitle={positionTitles.ledamot}
            />
          </>
        )}

        {(grouped.kommunfullmaktige.ordinary.length > 0 ||
          grouped.kommunfullmaktige.substitute.length > 0) && (
          <>
            <PoliticianSection
              title={sectionTitles.kommunfullmaktige}
              politicians={grouped.kommunfullmaktige.ordinary}
              cardType="small"
              positionTitle={positionTitles.ledamot}
            />
            <PoliticianSection
              title=""
              politicians={grouped.kommunfullmaktige.substitute}
              cardType="small"
              positionTitle={positionTitles.substitute}
            />
          </>
        )}
      </div>
      {politicians.length === 0 && (
        <p className="text-muted-foreground text-center py-12">
          Inga politiker tillgängliga för tillfället.
        </p>
      )}
    </div>
  );
}
