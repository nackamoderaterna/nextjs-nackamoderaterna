import {
  cleanPoliticianData,
  groupPoliticiansByRole,
  politiciansDirectoryQuery,
  PoliticianWithNamnd,
  sectionTitles as defaultSectionTitles,
} from "@/lib/politicians";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { buildBreadcrumbJsonLd } from "@/lib/utils/breadcrumbJsonLd";
import { PoliticianSection } from "@/lib/components/politician/PoliticianSection";
import { PoliticiansViewSwitcher } from "@/lib/components/politician/politicians-table/PoliticiansViewSwitcher";
import { generateMetadata as buildMetadata, getGlobalSeoDefaults } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ListingPageLayout } from "@/lib/components/shared/ListingPageLayout";
import { ResponsiveGrid } from "@/lib/components/shared/ResponsiveGrid";
import { EmptyState } from "@/lib/components/shared/EmptyState";
import type { ListingPage } from "@/lib/types/pages";
import { PeopleCard } from "@/lib/components/politician/PeopleCard";
import { Suspense } from "react";
import { Skeleton } from "@/lib/components/ui/skeleton";

export async function generateMetadata(): Promise<Metadata> {
  const [listing, defaults] = await Promise.all([
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "politicians" },
      { next: { revalidate: 86400 } }
    ),
    getGlobalSeoDefaults(),
  ]);

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
    image: listing?.seo?.image?.url ?? defaults.image,
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

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Hem", url: "/" },
    { name: "Politiker" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div>
      <ListingPageLayout
        title={listing?.title}
        intro={listing?.intro}
        fallbackTitle="Våra politiker"
        paddingY="compact"
      >
        <Suspense fallback={
          <div className="space-y-4">
            <div className="flex gap-2 mb-6">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
            </div>
          </div>
        }>
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
                  size="small"
                  email={politician.email}
                  phone={politician.phone}
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
                getTitle={(p) => p.livingArea?.name ?? ""}
              />
            )}
            {kommunfullmaktigeSubstitute.length > 0 && (
              <PoliticianSection
                title=""
                politicians={kommunfullmaktigeSubstitute}
                cardType="small"
                getTitle={(p) => p.livingArea?.name ?? ""}
              />
            )}
          </>
        )}
        {politicians.length === 0 && (
          <EmptyState message="Inga politiker tillgängliga för tillfället." />
        )}
        </PoliticiansViewSwitcher>
        </Suspense>
      </ListingPageLayout>
    </div>
    </>
  );
}
