import Link from "next/link";
import {
  cleanPoliticianData,
  groupPoliticiansByRole,
  politiciansDirectoryQuery,
  PoliticianWithNamnd,
  positionTitles,
  sectionTitles,
} from "@/lib/politicians";
import { ROUTE_BASE } from "@/lib/routes";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { PoliticianSection } from "@/lib/components/politician/PoliticianSection";
import { PoliticianCardSmall } from "@/lib/components/politician/PoliticianCardSmall";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ListingHeader } from "@/lib/components/shared/ListingHeader";

type ListingPage = {
  title?: string;
  intro?: string;
  seo?: {
    title?: string;
    description?: string;
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const listing = await sanityClient.fetch<ListingPage>(
    listingPageByKeyQuery,
    { key: "politicians" }
  );

  const title =
    listing?.seo?.title ||
    listing?.title ||
    "Våra politiker | Nackamoderaterna";
  const description =
    listing?.seo?.description ||
    "Läs mer om våra politiker och deras engagemang i Nacka";

  return buildMetadata({
    title,
    description,
    url: "/politiker",
  });
}

export const revalidate = 300;

// Helper to sort politicians alphabetically by name
function sortByName(politicians: PoliticianWithNamnd[]): PoliticianWithNamnd[] {
  return [...politicians].sort((a, b) => {
    const nameA = a.name || "";
    const nameB = b.name || "";
    return nameA.localeCompare(nameB, "sv");
  });
}

export default async function PoliticiansPage() {
  const [politiciansRaw, listing] = await Promise.all([
    sanityClient.fetch<PoliticianWithNamnd[]>(
      politiciansDirectoryQuery,
      {},
      {
        next: { revalidate: 300 },
      }
    ),
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "politicians" },
      {
        next: { revalidate: 300 },
      }
    ),
  ]);
  
  // Clean all invisible Unicode characters from politician data
  const politicians = politiciansRaw.map(cleanPoliticianData);
  const grouped = groupPoliticiansByRole(politicians);

  // Debug: Check what we got
  if (process.env.NODE_ENV === "development") {
    console.log("Grouped politicians:", {
      kommunalrad: {
        president: grouped.kommunalrad.president.length,
        ordinary: grouped.kommunalrad.ordinary.length,
      },
      kommunfullmaktige: {
        ordinary: grouped.kommunfullmaktige.ordinary.length,
        substitute: grouped.kommunfullmaktige.substitute.length,
      },
      partyBoard: {
        leaders: grouped.partyBoard.leaders.length,
        members: grouped.partyBoard.members.length,
      },
    });
    // Find politicians with kommunalrad or kommunfullmaktige
    const withKommunalrad = politicians.filter(p => p.kommunalrad?.active);
    const withKommunfullmaktige = politicians.filter(p => p.kommunfullmaktige?.active);
    console.log("Politicians with kommunalrad:", withKommunalrad.length, withKommunalrad.map(p => ({
      name: p.name,
      kommunalrad: p.kommunalrad
    })));
    console.log("Politicians with kommunfullmaktige:", withKommunfullmaktige.length, withKommunfullmaktige.map(p => ({
      name: p.name,
      kommunfullmaktige: p.kommunfullmaktige
    })));
    console.log("Kommunfullmaktige details:", grouped.kommunfullmaktige);
  }

  // Sort kommunfullmäktige alphabetically
  const kommunfullmaktigeOrdinary = sortByName(grouped.kommunfullmaktige.ordinary);
  const kommunfullmaktigeSubstitute = sortByName(grouped.kommunfullmaktige.substitute);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ListingHeader
          title={listing?.title}
          intro={listing?.intro}
          fallbackTitle="Våra politiker"
        />

        {/* 1. Kommunalråd */}
        {(grouped.kommunalrad.president.length > 0 ||
          grouped.kommunalrad.ordinary.length > 0) && (
          <PoliticianSection
            title={sectionTitles.kommunalrad}
            politicians={[
              ...grouped.kommunalrad.president,
              ...grouped.kommunalrad.ordinary,
            ]}
            cardType="large"
            getTitle={(p) =>
              p.kommunalrad?.role === "president"
                ? "Kommunstyrelsens ordförande"
                : "Kommunalråd"
            }
          />
        )}

        {/* 2. Nämnd leaders (no header, namnd name as subtitle) */}
        {grouped.namndLeaders.length > 0 && (
         
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gruppledare</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {grouped.namndLeaders.map(({ politician, namndTitle, positionTitle }) => (
                <Link
                  key={politician._id}
                  href={`${ROUTE_BASE.POLITICIANS}/${politician.slug?.current || ""}`}
                  className="block"
                >
                  <PoliticianCardSmall
                    name={politician.name}
                    image={politician.image}
                    subtitle={namndTitle}
                  />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 3. Partistyrelse */}
        {(grouped.partyBoard.leaders.length > 0 ||
          grouped.partyBoard.members.length > 0) && (
          <>
            <PoliticianSection
              title={sectionTitles.partyBoard}
              politicians={[
                ...grouped.partyBoard.leaders,
                ...grouped.partyBoard.members,
              ]}
              cardType="small"
              getTitle={(p) =>
                p.partyBoard?.title || (p.partyBoard?.isLeader ? "Ordförande" : "Ledamot")
              }
            />
          </>
        )}

        {/* 4. Kommunfullmäktige (ordinary first, then substitute, both alphabetically) */}
        {(kommunfullmaktigeOrdinary.length > 0 ||
          kommunfullmaktigeSubstitute.length > 0) && (
          <>
            {kommunfullmaktigeOrdinary.length > 0 && (
              <PoliticianSection
                title={sectionTitles.kommunfullmaktige}
                politicians={kommunfullmaktigeOrdinary}
                cardType="small"
                getTitle={(p) =>
                  p.kommunfullmaktige?.title ||
                  positionTitles.ordinary
                }
              />
            )}
            {kommunfullmaktigeSubstitute.length > 0 && (
              <PoliticianSection
                title=""
                politicians={kommunfullmaktigeSubstitute}
                cardType="small"
                getTitle={(p) =>
                  p.kommunfullmaktige?.title ||
                  positionTitles.substitute
                }
              />
            )}
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
