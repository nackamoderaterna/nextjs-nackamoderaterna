import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import { singleEventQuery } from "@/lib/queries/events";
import { Event } from "~/sanity.types";
import { SanityImage } from "@/lib/components/shared/SanityImage";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event: Event | null = await sanityClient.fetch(singleEventQuery, {
    slug,
  });

  if (!event) notFound();

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm text-gray-500">
            {new Date(event.startDate || Date.now()).toLocaleDateString(
              "sv-SE",
              {
                dateStyle: "long",
              },
            )}
            {event.endDate && (
              <>
                {" – "}
                {new Date(event.endDate).toLocaleDateString("sv-SE", {
                  dateStyle: "long",
                })}
              </>
            )}
          </p>

          <h1 className="text-3xl font-bold">{event.title}</h1>

          {event.location && (
            <p className="text-gray-600">
              {[event.location.venue, event.location.city]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
        </header>

        {event.image && (
          <div className="rounded-xl overflow-hidden">
            <SanityImage image={event.image} className="w-full h-auto" />
          </div>
        )}

        {event.description && (
          <div className="prose prose-neutral max-w-none">
            <PortableText value={event.description} />
          </div>
        )}

        {event.registrationUrl && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 transition"
          >
            Anmäl dig
          </a>
        )}
      </div>
    </main>
  );
}
