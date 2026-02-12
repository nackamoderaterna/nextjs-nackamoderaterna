import { EventSidebar, EventList } from "@/lib/components/events/EventCalendar";
import { EventFilters } from "@/lib/components/events/EventFilters";
import { ContentWithSidebar } from "@/lib/components/shared/ContentWithSidebar";
import { ListingPageLayout } from "@/lib/components/shared/ListingPageLayout";
import {
  eventTypesQuery,
  buildUpcomingEventsQuery,
} from "@/lib/queries/events";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { Event } from "~/sanity.types";
import type { ListingPage } from "@/lib/types/pages";
import { ROUTE_BASE } from "@/lib/routes";

const EVENTS_CACHE_SECONDS = 86400;
const INITIAL_LIMIT = 10;

export async function generateMetadata(): Promise<Metadata> {
  const listing = await sanityClient.fetch<ListingPage>(
    listingPageByKeyQuery,
    { key: "events" },
    { next: { revalidate: EVENTS_CACHE_SECONDS } }
  );

  const title =
    listing?.seo?.title || listing?.title || "Evenemang | Nackamoderaterna";
  const description =
    listing?.seo?.description || "Kommande evenemang och aktiviteter";

  return buildMetadata({
    title,
    description,
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

  const query = buildUpcomingEventsQuery({
    typeFilter: !!typeSlug,
    publicOnly,
  });

  const queryParams: Record<string, unknown> = { limit: INITIAL_LIMIT };
  if (typeSlug) queryParams.eventTypeSlug = typeSlug;

  const [listing, eventTypes, eventsData] = await Promise.all([
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
      query,
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
      <ContentWithSidebar
        mainContent={
          <EventList
            key={`${typeSlug}-${publicOnly}`}
            initialEvents={eventsData.items}
            total={eventsData.total}
            typeSlug={typeSlug || undefined}
            publicOnly={publicOnly || undefined}
          />
        }
        sidebarContent={<EventSidebar />}
      />
    </ListingPageLayout>
  );
}
