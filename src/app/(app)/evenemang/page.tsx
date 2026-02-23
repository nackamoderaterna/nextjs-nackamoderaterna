import { EventFilters } from "@/lib/components/events/EventFilters";
import { EventTabs } from "@/lib/components/events/EventTabs";
import { ListingPageLayout } from "@/lib/components/shared/ListingPageLayout";
import {
  eventTypesQuery,
  buildPaginatedEventsQuery,
} from "@/lib/queries/events";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { generateMetadata as buildMetadata, getGlobalSeoDefaults } from "@/lib/utils/seo";
import { Metadata } from "next";
import { Event } from "~/sanity.types";
import type { ListingPage } from "@/lib/types/pages";
import { ROUTE_BASE } from "@/lib/routes";

const EVENTS_CACHE_SECONDS = 86400;
const PAGE_SIZE = 10;

export async function generateMetadata(): Promise<Metadata> {
  const [listing, defaults] = await Promise.all([
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "events" },
      { next: { revalidate: EVENTS_CACHE_SECONDS } }
    ),
    getGlobalSeoDefaults(),
  ]);

  const title =
    listing?.seo?.title || listing?.title || "Evenemang | Nackamoderaterna";
  const description =
    listing?.seo?.description || "Kommande evenemang och aktiviteter";

  return buildMetadata({
    title,
    description,
    image: listing?.seo?.image?.url ?? defaults.image,
    url: ROUTE_BASE.EVENTS,
  });
}

export const revalidate = 86400;

interface EventTypeDoc {
  _id: string;
  name: string;
  slug: { current: string };
  color?: string;
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; public?: string }>;
}) {
  const params = await searchParams;
  const typeSlug = params.type || "";
  const publicOnly = params.public === "true";

  const upcomingQuery = buildPaginatedEventsQuery("upcoming", {
    typeFilter: !!typeSlug,
    publicOnly,
  });
  const pastQuery = buildPaginatedEventsQuery("past", {
    typeFilter: !!typeSlug,
    publicOnly,
  });

  const queryParams: Record<string, unknown> = { start: 0, end: PAGE_SIZE };
  if (typeSlug) queryParams.eventTypeSlug = typeSlug;

  const [listing, eventTypes, upcomingData, pastData] = await Promise.all([
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "events" },
      { next: { revalidate: EVENTS_CACHE_SECONDS } }
    ),
    sanityClient.fetch<EventTypeDoc[]>(
      eventTypesQuery,
      {},
      { next: { revalidate: EVENTS_CACHE_SECONDS } }
    ),
    sanityClient.fetch<{ items: Event[]; total: number }>(
      upcomingQuery,
      queryParams,
      { next: { revalidate: EVENTS_CACHE_SECONDS } }
    ),
    sanityClient.fetch<{ items: Event[]; total: number }>(
      pastQuery,
      queryParams,
      { next: { revalidate: EVENTS_CACHE_SECONDS } }
    ),
  ]);

  return (
    <ListingPageLayout
      title={listing?.title}
      intro={listing?.intro}
      fallbackTitle="Evenemang"
      paddingY="top"
      as="main"
    >
      <EventFilters eventTypes={eventTypes} />
      <EventTabs
        key={`${typeSlug}-${publicOnly}`}
        initialUpcoming={upcomingData.items}
        upcomingTotal={upcomingData.total}
        initialPast={pastData.items}
        pastTotal={pastData.total}
        typeSlug={typeSlug || undefined}
        publicOnly={publicOnly || undefined}
      />
    </ListingPageLayout>
  );
}
