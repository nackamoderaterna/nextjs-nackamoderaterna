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
  upcomingEventsPaginatedQuery,
  pastEventsPaginatedQuery,
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

const ITEMS_PER_PAGE = 10;
const EVENTS_CACHE_SECONDS = 300;

export async function generateMetadata(): Promise<Metadata> {
  const listing = await sanityClient.fetch<ListingPage>(
    listingPageByKeyQuery,
    { key: "events" }
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

export const dynamic = "force-dynamic";

function renderEventCard(
  event: Event,
  className?: string,
  muted?: boolean
) {
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
      className={className}
    />
  );
}

type PaginatedResult = { items: Event[]; total: number };

const VALID_VIEWS = ["all", "kommande", "tidigare"] as const;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; view?: string }>;
}) {
  const params = await searchParams;
  const viewParam = params.view || "all";
  const view = VALID_VIEWS.includes(viewParam as (typeof VALID_VIEWS)[number])
    ? (viewParam as (typeof VALID_VIEWS)[number])
    : "all";
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  const listing = await sanityClient.fetch<ListingPage>(
    listingPageByKeyQuery,
    { key: "events" },
    { next: { revalidate: EVENTS_CACHE_SECONDS } }
  );

  // Section titles from CMS with fallbacks
  const titles = {
    upcoming: listing?.sectionTitles?.upcoming || "Kommande",
    past: listing?.sectionTitles?.past || "Tidigare",
  };

  if (view === "kommande") {
    const result = await sanityClient.fetch<PaginatedResult>(
      upcomingEventsPaginatedQuery,
      { start, end },
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
          <EventFilters />
          <EmptyState message="Sidan kunde inte hittas." />
        </ListingPageLayout>
      );
    }

    return (
      <ListingPageLayout
        title={listing?.title}
        intro={listing?.intro}
        fallbackTitle="Evenemang"
        paddingY="top"
        as="main"
      >
        <EventFilters />
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
                  preserveParams={{ view: "kommande" }}
                />
              </>
            )}
        </Section>

        <Block maxWidth="3xl" paddingY="large" background="muted">
          <ContactForm
            heading="Kontakta oss"
            description="Har du frågor eller vill engagera dig? Fyll i formuläret nedan så återkommer vi så snart som möjligt."
          />
        </Block>
      </ListingPageLayout>
    );
  }

  if (view === "tidigare") {
    const result = await sanityClient.fetch<PaginatedResult>(
      pastEventsPaginatedQuery,
      { start, end },
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
          <EventFilters />
          <EmptyState message="Sidan kunde inte hittas." />
        </ListingPageLayout>
      );
    }

    const mutedClass =
      "bg-muted hover:bg-muted/50 text-muted-foreground [&_.text-brand-primary]:text-muted-foreground";

    return (
      <ListingPageLayout
        title={listing?.title}
        intro={listing?.intro}
        fallbackTitle="Evenemang"
        paddingY="top"
        as="main"
      >
        <EventFilters />
        <Section title={titles.past}>
          {items.length === 0 ? (
              <EmptyState message="Inga tidigare evenemang." />
            ) : (
              <>
                <ResponsiveGrid cols={3} gap="large">
                  {items.map((event) => renderEventCard(event, mutedClass, true))}
                </ResponsiveGrid>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath={ROUTE_BASE.EVENTS}
                  preserveParams={{ view: "tidigare" }}
                />
              </>
            )}
        </Section>
        <Block maxWidth="3xl" paddingY="large" background="muted">
          <ContactForm
            heading="Kontakta oss"
            description="Har du frågor eller vill engagera dig? Fyll i formuläret nedan så återkommer vi så snart som möjligt."
          />
        </Block>
      </ListingPageLayout>
    );
  }

  // view === "all": show 8 events (4 upcoming + 4 past), links to filtered views
  const [events] = await Promise.all([
    sanityClient.fetch<Event[]>(allEventsQuery, {}, {
      next: { revalidate: EVENTS_CACHE_SECONDS },
    }),
  ]);

  const now = new Date().toISOString();
  const upcoming = events.filter((e) => (e.startDate || "") >= now);
  const past = events
    .filter((e) => (e.startDate || "") < now)
    .reverse();

  const upcomingDisplay = upcoming.slice(0, 4);
  const pastDisplay = past.slice(0, 4);

  return (
    <ListingPageLayout
      title={listing?.title}
      intro={listing?.intro}
      fallbackTitle="Evenemang"
      paddingY="top"
      as="main"
    >
      <EventFilters />
      <Section title={titles.upcoming}>
      {upcomingDisplay.length === 0 ? (
            <EmptyState message="Inga kommande evenemang för tillfället." />
          ) : (
            <>
              <ResponsiveGrid cols={3} gap="large">
                {upcomingDisplay.map((event) => renderEventCard(event))}
              </ResponsiveGrid>
              {upcoming.length > 4 && (
                <p className="mt-6">
                  <Link
                    href={`${ROUTE_BASE.EVENTS}?view=kommande`}
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
                renderEventCard(
                  event,
                  "bg-muted hover:bg-muted/50 text-muted-foreground [&_.text-brand-primary]:text-muted-foreground",
                  true
                )
              )}
            </ResponsiveGrid>
            {past.length > 4 && (
              <p className="mt-6">
                <Link
                  href={`${ROUTE_BASE.EVENTS}?view=tidigare`}
                  className="text-primary font-medium hover:underline"
                >
                  Visa alla tidigare
                </Link>
              </p>
            )}
        </Section>
      )}

      <Block maxWidth="3xl" paddingY="large" background="muted">
        <ContactForm
          heading="Kontakta oss"
          description="Har du frågor eller vill engagera dig? Fyll i formuläret nedan så återkommer vi så snart som möjligt."
        />
      </Block>
    </ListingPageLayout>
  );
}
