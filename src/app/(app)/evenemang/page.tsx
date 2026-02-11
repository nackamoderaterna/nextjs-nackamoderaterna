import Block from "@/lib/components/blocks/Block";
import { EventCard } from "@/lib/components/events/eventCard";
import { EventFilters } from "@/lib/components/events/EventFilters";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { ListingPageLayout } from "@/lib/components/shared/ListingPageLayout";
import { EmptyState } from "@/lib/components/shared/EmptyState";
import { Pagination } from "@/lib/components/news/Pagination";
import Link from "next/link";
import {
  allEventsQuery,
  eventTypesQuery,
  buildPaginatedEventsQuery,
} from "@/lib/queries/events";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { formatAddress, getMonth } from "@/lib/utils/dateUtils";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { Event } from "~/sanity.types";
import type { ListingPage } from "@/lib/types/pages";
import { ROUTE_BASE } from "@/lib/routes";
import { ResponsiveGrid } from "@/lib/components/shared/ResponsiveGrid";
import { Section } from "@/lib/components/shared/Section";

const ITEMS_PER_PAGE = 12;
const EVENTS_CACHE_SECONDS = 86400;

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

function renderEventCard(event: Event, muted?: boolean) {
  const location = formatAddress(event.location ?? undefined);

  return (
    <EventCard
      key={event._id}
      day={new Date(event.startDate || "").getDate().toString().padStart(2, "0")}
      month={getMonth(event.startDate || "")}
      title={event.title || ""}
      time=""
      location={location}
      href={event.slug?.current || ""}
      isPublic={event.isPublic ?? false}
      muted={muted}
      eventTypeName={(event.eventType as unknown as EventTypeDoc | null)?.name || ""}
    />
  );
}

type PaginatedResult = { items: Event[]; total: number };

interface EventTypeDoc {
  _id: string;
  name: string;
  slug: { current: string };
}

const VALID_VIEWS = ["all", "kommande", "tidigare"] as const;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; view?: string; type?: string; public?: string }>;
}) {
  const params = await searchParams;
  const viewParam = params.view || "all";
  const view = VALID_VIEWS.includes(viewParam as (typeof VALID_VIEWS)[number])
    ? (viewParam as (typeof VALID_VIEWS)[number])
    : "all";
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const typeSlug = params.type || "";
  const publicOnly = params.public === "true";

  const [listing, eventTypes] = await Promise.all([
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
  ]);

  // Section titles from CMS with fallbacks
  const titles = {
    upcoming: listing?.sectionTitles?.upcoming || "Kommande",
    past: listing?.sectionTitles?.past || "Tidigare",
  };

  if (view === "kommande") {
    const query = buildPaginatedEventsQuery("upcoming", {
      typeFilter: !!typeSlug,
      publicOnly,
    });
    const queryParams: Record<string, unknown> = { start, end };
    if (typeSlug) queryParams.eventTypeSlug = typeSlug;

    const result = await sanityClient.fetch<PaginatedResult>(
      query,
      queryParams,
      { next: { revalidate: EVENTS_CACHE_SECONDS } }
    );
    const { items, total } = result;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    if (currentPage > totalPages && totalPages > 0) {
      return (
        <ListingPageLayout
          title={listing?.title}
          intro={listing?.intro}
          fallbackTitle="Evenemang"
          paddingY="top"
          as="main"
        >
          <EventFilters eventTypes={eventTypes} />
          <EmptyState message="Sidan kunde inte hittas." />
        </ListingPageLayout>
      );
    }

    const preserveParams: Record<string, string> = { view: "kommande" };
    if (typeSlug) preserveParams.type = typeSlug;
    if (publicOnly) preserveParams.public = "true";

    return (
      <ListingPageLayout
        title={listing?.title}
        intro={listing?.intro}
        fallbackTitle="Evenemang"
        paddingY="top"
        as="main"
      >
        <EventFilters eventTypes={eventTypes} />
        <Section title={titles.upcoming}>
        {items.length === 0 ? (
              <EmptyState message="Inga kommande evenemang för tillfället." />
            ) : (
              <>
                <ResponsiveGrid cols={3} gap="large">
                  {items.map((event) => renderEventCard(event))}
                </ResponsiveGrid>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath={ROUTE_BASE.EVENTS}
                  preserveParams={preserveParams}
                />
              </>
            )}
        </Section>

        <Block paddingY="large" background="muted">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm
            heading="Kontakta oss"
            description="Har du frågor eller vill engagera dig? Fyll i formuläret nedan så återkommer vi så snart som möjligt."
          />
          </div>
        </Block>
      </ListingPageLayout>
    );
  }

  if (view === "tidigare") {
    const query = buildPaginatedEventsQuery("past", {
      typeFilter: !!typeSlug,
      publicOnly,
    });
    const queryParams: Record<string, unknown> = { start, end };
    if (typeSlug) queryParams.eventTypeSlug = typeSlug;

    const result = await sanityClient.fetch<PaginatedResult>(
      query,
      queryParams,
      { next: { revalidate: EVENTS_CACHE_SECONDS } }
    );
    const { items, total } = result;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    if (currentPage > totalPages && totalPages > 0) {
      return (
        <ListingPageLayout
          title={listing?.title}
          intro={listing?.intro}
          fallbackTitle="Evenemang"
          paddingY="top"
          as="main"
        >
          <EventFilters eventTypes={eventTypes} />
          <EmptyState message="Sidan kunde inte hittas." />
        </ListingPageLayout>
      );
    }

    const preserveParams: Record<string, string> = { view: "tidigare" };
    if (typeSlug) preserveParams.type = typeSlug;
    if (publicOnly) preserveParams.public = "true";

    return (
      <ListingPageLayout
        title={listing?.title}
        intro={listing?.intro}
        fallbackTitle="Evenemang"
        paddingY="top"
        as="main"
      >
        <EventFilters eventTypes={eventTypes} />
        <Section title={titles.past}>
          {items.length === 0 ? (
              <EmptyState message="Inga tidigare evenemang." />
            ) : (
              <>
                <ResponsiveGrid cols={3} gap="large">
                  {items.map((event) => renderEventCard(event, true))}
                </ResponsiveGrid>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath={ROUTE_BASE.EVENTS}
                  preserveParams={preserveParams}
                />
              </>
            )}
        </Section>
        <Block paddingY="large" background="muted">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm
            heading="Kontakta oss"
            description="Har du frågor eller vill engagera dig? Fyll i formuläret nedan så återkommer vi så snart som möjligt."
          />
          </div>
        </Block>
      </ListingPageLayout>
    );
  }

  // view === "all": show 12 events (6 upcoming + 6 past), links to filtered views
  const [events] = await Promise.all([
    sanityClient.fetch<Event[]>(allEventsQuery, {}, {
      next: { revalidate: EVENTS_CACHE_SECONDS },
    }),
  ]);

  const now = new Date().toISOString();
  let upcoming = events.filter((e) => (e.startDate || "") >= now);
  let past = events
    .filter((e) => (e.startDate || "") < now)
    .reverse();

  // Apply type filter on the "all" view
  if (typeSlug) {
    upcoming = upcoming.filter(
      (e) => (e.eventType as unknown as EventTypeDoc | null)?.slug?.current === typeSlug
    );
    past = past.filter(
      (e) => (e.eventType as unknown as EventTypeDoc | null)?.slug?.current === typeSlug
    );
  }

  // Apply public filter on the "all" view
  if (publicOnly) {
    upcoming = upcoming.filter((e) => e.isPublic);
    past = past.filter((e) => e.isPublic);
  }

  const upcomingDisplay = upcoming.slice(0, 6);
  const pastDisplay = past.slice(0, 6);

  return (
    <ListingPageLayout
      title={listing?.title}
      intro={listing?.intro}
      fallbackTitle="Evenemang"
      paddingY="top"
      as="main"
    >
      <EventFilters eventTypes={eventTypes} />
      <Section title={titles.upcoming}>
      {upcomingDisplay.length === 0 ? (
            <EmptyState message="Inga kommande evenemang för tillfället." />
          ) : (
            <>
              <ResponsiveGrid cols={3} gap="large">
                {upcomingDisplay.map((event) => renderEventCard(event))}
              </ResponsiveGrid>
              {upcoming.length > 6 && (
                <p className="mt-6">
                  <Link
                    href={`${ROUTE_BASE.EVENTS}?view=kommande${typeSlug ? `&type=${typeSlug}` : ""}${publicOnly ? "&public=true" : ""}`}
                    className="text-primary font-medium hover:underline"
                  >
                    Visa alla kommande
                  </Link>
                </p>
              )}
            </>
          )}
      </Section>


      {pastDisplay.length > 0 && (
        <Section title={titles.past}>
            <ResponsiveGrid cols={3} gap="large">
              {pastDisplay.map((event) =>
                renderEventCard(event, true)
              )}
            </ResponsiveGrid>
            {past.length > 6 && (
              <p className="mt-6">
                <Link
                  href={`${ROUTE_BASE.EVENTS}?view=tidigare${typeSlug ? `&type=${typeSlug}` : ""}${publicOnly ? "&public=true" : ""}`}
                  className="text-primary font-medium hover:underline"
                >
                  Visa alla tidigare
                </Link>
              </p>
            )}
        </Section>
      )}

      <Block paddingY="large" background="muted">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContactForm
          heading="Kontakta oss"
          description="Har du frågor eller vill engagera dig? Fyll i formuläret nedan så återkommer vi så snart som möjligt."
        />
        </div>
      </Block>
    </ListingPageLayout>
  );
}
