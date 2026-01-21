import { ContactBlock } from "@/lib/components/blocks/ContactBlock";
import { EngageBlock } from "@/lib/components/blocks/EngageBlock";
import { EventCard } from "@/lib/components/events/eventCard";
import { upcomingEventsQuery } from "@/lib/queries/events";
import { sanityClient, REVALIDATE_TIME } from "@/lib/sanity/client";
import { formatDate, getMonth } from "@/lib/utils/dateUtils";
import { generateMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { Event } from "~/sanity.types";

export const metadata: Metadata = generateMetadata({
  title: "Evenemang | Nackamoderaterna",
  description: "Kommande evenemang och aktiviteter",
  url: "/event",
});

export const dynamic = "force-dynamic";
export const revalidate = REVALIDATE_TIME;

export default async function EventsPage() {
  const events: Event[] = await sanityClient.fetch(
    upcomingEventsQuery,
    {},
    {
      next: { revalidate: REVALIDATE_TIME },
    }
  );

  return (
    <main className="flex-1 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Event
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Luctus consequat dis
            scelerisque convallis ut pretium eu. Gravida curabitur sed proin
            egestas id pulvinar eget. Ultricies orci fringilla donec velit
            massa. Pellentesque integer erat laoreet nulla. Iaculis congue massa
            nisl dictum. Quam habitant fusce dui sed donec orci pharetra est.
            Cras sollicitudin dui nisl eget eleifend.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  location={event.location?.address || ""}
                  href={event.slug?.current || ""}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Block */}
      <ContactBlock />

      {/* Engage Block */}
      <EngageBlock />
    </main>
  );
}
