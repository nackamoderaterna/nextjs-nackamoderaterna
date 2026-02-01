import Block from "@/lib/components/blocks/Block";
import { EventCard } from "@/lib/components/events/eventCard";
import { EventFilters } from "@/lib/components/events/EventFilters";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { ListingHeader } from "@/lib/components/shared/ListingHeader";
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

const ITEMS_PER_PAGE = 10;
const EVENTS_CACHE_SECONDS = 86400;

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
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ListingHeader
            title={listing?.title}
            intro={listing?.intro}
            fallbackTitle="Evenemang"
          />
          <EventFilters />
          <p className="text-muted-foreground text-center py-12">
            Sidan kunde inte hittas.
          </p>
        </main>
      );
    }

    return (
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="pb-12 md:py-16">
          <div className="max-w-7xl">
            <ListingHeader
              title={listing?.title}
              intro={listing?.intro}
              fallbackTitle="Evenemang"
            />
          </div>
        </section>
        <EventFilters />
        <section className="pb-10">
          <div className="max-w-7xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Kommande
            </h2>
            {items.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">
                Inga kommande evenemang för tillfället.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((event) => renderEventCard(event))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath={ROUTE_BASE.EVENTS}
                  preserveParams={{ view: "kommande" }}
                />
              </>
            )}
          </div>
        </section>
        <Block maxWidth="3xl" paddingY="large" background="muted">
          <ContactForm
            heading="Kontakta oss"
            description="Har du frågor eller vill engagera dig? Fyll i formuläret nedan så återkommer vi så snart som möjligt."
          />
        </Block>
      </main>
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
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ListingHeader
            title={listing?.title}
            intro={listing?.intro}
            fallbackTitle="Evenemang"
          />
          <EventFilters />
          <p className="text-muted-foreground text-center py-12">
            Sidan kunde inte hittas.
          </p>
        </main>
      );
    }

    const mutedClass =
      "bg-muted hover:bg-muted/50 text-muted-foreground [&_.text-brand-primary]:text-muted-foreground";

    return (
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-12 md:py-16">
          <div className="max-w-7xl">
            <ListingHeader
              title={listing?.title}
              intro={listing?.intro}
              fallbackTitle="Evenemang"
            />
          </div>
        </section>
        <EventFilters />
        <section className="pb-16">
          <div className="max-w-7xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Tidigare
            </h2>
            {items.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">
                Inga tidigare evenemang.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((event) =>
                    renderEventCard(event, mutedClass, true)
                  )}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath={ROUTE_BASE.EVENTS}
                  preserveParams={{ view: "tidigare" }}
                />
              </>
            )}
          </div>
        </section>
        <Block maxWidth="3xl" paddingY="large" background="muted">
          <ContactForm
            heading="Kontakta oss"
            description="Har du frågor eller vill engagera dig? Fyll i formuläret nedan så återkommer vi så snart som möjligt."
          />
        </Block>
      </main>
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
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="py-12 md:py-16">
        <div className="max-w-7xl">
          <ListingHeader
            title={listing?.title}
            intro={listing?.intro}
            fallbackTitle="Evenemang"
          />
        </div>
      </section>

      <EventFilters />

      <section className="pb-10">
        <div className="max-w-7xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Kommande
          </h2>
          {upcomingDisplay.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              Inga kommande evenemang för tillfället.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingDisplay.map((event) => renderEventCard(event))}
              </div>
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
        </div>
      </section>

      {pastDisplay.length > 0 && (
        <section className="pb-16">
          <div className="max-w-7xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Tidigare
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastDisplay.map((event) =>
                renderEventCard(
                  event,
                  "bg-muted hover:bg-muted/50 text-muted-foreground [&_.text-brand-primary]:text-muted-foreground",
                  true
                )
              )}
            </div>
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
          </div>
        </section>
      )}

      <Block maxWidth="3xl" paddingY="large" background="muted">
        <ContactForm
          heading="Kontakta oss"
          description="Har du frågor eller vill engagera dig? Fyll i formuläret nedan så återkommer vi så snart som möjligt."
        />
      </Block>
    </main>
  );
}
