import Block from "@/lib/components/blocks/Block";
import { EventCard } from "@/lib/components/events/eventCard";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { upcomingEventsQuery } from "@/lib/queries/events";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { getMonth } from "@/lib/utils/dateUtils";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { Event } from "~/sanity.types";
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
    { key: "events" }
  );

  const title =
    listing?.seo?.title || listing?.title || "Evenemang | Nackamoderaterna";
  const description =
    listing?.seo?.description || "Kommande evenemang och aktiviteter";

  return buildMetadata({
    title,
    description,
    url: "/event",
  });
}

export const revalidate = 300;

export default async function EventsPage() {
  const [events, listing] = await Promise.all([
    sanityClient.fetch<Event[]>(
      upcomingEventsQuery,
      {},
      {
        next: { revalidate: 300 },
      }
    ),
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "events" },
      {
        next: { revalidate: 300 },
      }
    ),
  ]);

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

      {/* Events Grid */}
      <section className="pb-16">
        <div className="max-w-7xl">
          {events.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              Inga kommande evenemang för tillfället.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  day={new Date(event.startDate || "").getDate().toString()}
                  month={getMonth(event.startDate || "")}
                  title={event.title || ""}
                  time={""}
                  location={`${event.location?.venue || ""}, ${event.location?.address || ""}`}
                  href={event.slug?.current || ""}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Block */}
      <Block maxWidth="3xl" paddingY="large" background="muted">
      <ContactForm heading="Kontakta oss" description="Har du frågor eller vill engagera dig? Fyll i formuläret nedan så återkommer vi så snart som möjligt." />
      </Block >
    </main>
  );
}
