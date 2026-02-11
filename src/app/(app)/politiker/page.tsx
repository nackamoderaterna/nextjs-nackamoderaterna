import {
  cleanPoliticianData,
  groupPoliticiansByRole,
  politiciansDirectoryQuery,
  PoliticianWithNamnd,
  positionTitles,
  sectionTitles as defaultSectionTitles,
} from "@/lib/politicians";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { PoliticianSection } from "@/lib/components/politician/PoliticianSection";
import { PoliticiansViewSwitcher } from "@/lib/components/politician/politicians-table/PoliticiansViewSwitcher";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ListingPageLayout } from "@/lib/components/shared/ListingPageLayout";
import { ResponsiveGrid } from "@/lib/components/shared/ResponsiveGrid";
import { EmptyState } from "@/lib/components/shared/EmptyState";
import type { ListingPage } from "@/lib/types/pages";
import { PeopleCard } from "@/lib/components/politician/PeopleCard";

export async function generateMetadata(): Promise<Metadata> {
  const listing = await sanityClient.fetch<ListingPage>(
    listingPageByKeyQuery,
    { key: "politicians" },
    { next: { revalidate: 86400 } }
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

export const revalidate = 86400;

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
        next: { revalidate: 86400 },
      }
    ),
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "politicians" },
      {
        next: { revalidate: 86400 },
      }
    ),
  ]);
  
  // Clean all invisible Unicode characters from politician data
  const politicians = politiciansRaw.map(cleanPoliticianData);
  const grouped = groupPoliticiansByRole(politicians);

  // Sort kommunfullmäktige alphabetically
  const kommunfullmaktigeOrdinary = sortByName(grouped.kommunfullmaktige.ordinary);
  const kommunfullmaktigeSubstitute = sortByName(grouped.kommunfullmaktige.substitute);

  // Section titles from CMS with fallbacks
  const sectionTitles = {
    kommunalrad: listing?.sectionTitles?.kommunalrad || defaultSectionTitles.kommunalrad,
    groupLeaders: listing?.sectionTitles?.groupLeaders || "Gruppledare",
    partyBoard: listing?.sectionTitles?.partyBoard || defaultSectionTitles.partyBoard,
    kommunfullmaktige: listing?.sectionTitles?.kommunfullmaktige || defaultSectionTitles.kommunfullmaktige,
    other: listing?.sectionTitles?.otherPoliticians || defaultSectionTitles.other,
  };

  return (
    <div>
      <ListingPageLayout
        title={listing?.title}
        intro={listing?.intro}
        fallbackTitle="Våra politiker"
        paddingY="compact"
      >
        <PoliticiansViewSwitcher politicians={politicians}>
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
            getTitle={(p) => p.livingArea?.name ?? ""}
          />
        )}

        {/* 2. Nämnd leaders (no header, namnd name as subtitle) */}
        {grouped.namndLeaders.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">{sectionTitles.groupLeaders}</h2>
            <ResponsiveGrid cols={3}>
              {grouped.namndLeaders.map(({ politician, namndTitle }) => (
                <PeopleCard
                  key={politician._id}
                  slug={politician.slug?.current || ""}
                  image={politician.image}
                  name={politician.name}
                  title={namndTitle}
                  size="medium"
                />
              ))}
            </ResponsiveGrid>
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
        {politicians.length === 0 && (
          <EmptyState message="Inga politiker tillgängliga för tillfället." />
        )}
        </PoliticiansViewSwitcher>
      </ListingPageLayout>
    </div>
  );
}
