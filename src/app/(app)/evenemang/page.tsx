import Block from "@/lib/components/blocks/Block";
import { EventCard } from "@/lib/components/events/eventCard";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { allEventsQuery } from "@/lib/queries/events";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { getMonth } from "@/lib/utils/dateUtils";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { Event } from "~/sanity.types";
import { ListingHeader } from "@/lib/components/shared/ListingHeader";
import type { ListingPage } from "@/lib/types/pages";
import { ROUTE_BASE } from "@/lib/routes";

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

// Time-based split (upcoming vs past) uses request-time "now"; Sanity data is cached 24h via fetch revalidate
export const dynamic = "force-dynamic";

const EVENTS_CACHE_SECONDS = 86400; // 24 hours

function renderEventCard(
  event: Event,
  className?: string,
  muted?: boolean
) {
  const locationParts = [
    event.location?.venue,
    event.location?.address,
  ].filter((s): s is string => typeof s === "string" && s.trim() !== "");
  const location = locationParts.join(", ");

  return (
    <EventCard
      key={event._id}
      day={new Date(event.startDate || "").getDate().toString().padStart(2, "0")}
      month={getMonth(event.startDate || "")}
      title={event.title || ""}
      time={""}
      location={location}
      href={event.slug?.current || ""}
      isPublic={event.isPublic ?? false}
      muted={muted}
      className={className}
    />
  );
}

export default async function EventsPage() {
  const [events, listing] = await Promise.all([
    sanityClient.fetch<Event[]>(allEventsQuery, {}, {
      next: { revalidate: EVENTS_CACHE_SECONDS },
    }),
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "events" },
      {
        next: { revalidate: EVENTS_CACHE_SECONDS },
      }
    ),
  ]);

  const now = new Date().toISOString();
  const upcoming = events.filter((e) => (e.startDate || "") >= now);
  const past = events
    .filter((e) => (e.startDate || "") < now)
    .reverse();

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl">
          <ListingHeader
            title={listing?.title}
            intro={listing?.intro}
            fallbackTitle="Evenemang"
          />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="pb-10">
        <div className="max-w-7xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Kommande evenemang
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              Inga kommande evenemang för tillfället.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((event) => renderEventCard(event))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {past.length > 0 && (
        <section className="pb-16">
          <div className="max-w-7xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Tidigare evenemang
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((event) =>
                renderEventCard(
                  event,
                  "bg-muted hover:bg-muted/50 text-muted-foreground [&_.text-brand-primary]:text-muted-foreground",
                  true
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact Block */}
      <Block maxWidth="3xl" paddingY="large" background="muted">
      <ContactForm heading="Kontakta oss" description="Har du frågor eller vill engagera dig? Fyll i formuläret nedan så återkommer vi så snart som möjligt." />
      </Block >
    </main>
  );
}
