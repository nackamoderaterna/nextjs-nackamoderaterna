import { EventCard } from "@/lib/components/events/eventCard";
import { upcomingEventsQuery } from "@/lib/queries/events";
import { sanityClient } from "@/lib/sanity/client";
import { Metadata } from "next";
import { Event } from "~/sanity.types";

export const metadata: Metadata = {
  title: "Evenemang",
  description: "Kommande evenemang",
};

export default async function EventsPage() {
  const events: Event[] = await sanityClient.fetch(upcomingEventsQuery);

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Kommande evenemang</h1>

      {events.length === 0 ? (
        <p className="text-gray-600">Inga kommande evenemang just nu.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
}
