import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import { singleEventQuery, allEventSlugsQuery } from "@/lib/queries/events";
import { portableTextComponents } from "@/lib/components/shared/PortableTextComponents";
import { Event } from "~/sanity.types";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { cleanInvisibleUnicode } from "@/lib/politicians";
import {
  formatEventDate,
  formatTimeRange,
  formatAddress,
  generateCalendarLink,
  calendarFilename,
} from "@/lib/utils/dateUtils";
import { generateMetadata as generateSEOMetadata, getDefaultOgImage } from "@/lib/utils/seo";
import { Metadata } from "next";
import { buildImageUrl } from "@/lib/sanity/image";
import { Button } from "@/lib/components/ui/button";
import { ROUTE_BASE } from "@/lib/routes";

// Generate static params for all events at build time
export async function generateStaticParams() {
  const events = await sanityClient.fetch<{ slug: string }[]>(
    allEventSlugsQuery
  );
  
  return events.map((event) => ({
    slug: event.slug,
  }));
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const [event, fallbackImage] = await Promise.all([
    sanityClient.fetch<Event | null>(singleEventQuery, { slug }),
    getDefaultOgImage(),
  ]);

  if (!event) {
    return generateSEOMetadata({
      title: "Evenemang hittades inte",
      description: "Det begärda evenemanget kunde inte hittas",
    });
  }

  const imageUrl = event.image
    ? buildImageUrl(event.image, { width: 1200, height: 630 })
    : fallbackImage;

  return generateSEOMetadata({
    title: `${event.title} | Nackamoderaterna`,
    description: event.description
      ? `${event.title} - ${event.description[0]?.children?.[0]?.text?.substring(0, 150)}...`
      : `Läs mer om evenemanget ${event.title}`,
    image: imageUrl,
    url: `${ROUTE_BASE.EVENTS}/${slug}`,
    type: "article",
  });
}

export const revalidate = 300;

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event: Event | null = await sanityClient.fetch(
    singleEventQuery,
    { slug },
    {
      next: { revalidate: 300 },
    }
  );

  if (!event) notFound();

  const eventDate = event.startDate
    ? formatEventDate(event.startDate)
    : "";
  const eventTime = event.startDate
    ? formatTimeRange(event.startDate, event.endDate)
    : "";
  const address = formatAddress(event.location);
  const descriptionText = event.description
    ? event.description
        .map((b) =>
          b._type === "block" && b.children
            ? b.children.map((c) => (c as { text?: string }).text ?? "").join("")
            : ""
        )
        .join(" ")
        .trim()
    : "";
  const calendarLink = generateCalendarLink(
    event.title ?? "Evenemang",
    event.startDate ?? new Date(),
    event.endDate ?? undefined,
    descriptionText || undefined,
    address || undefined
  );

  return (
    <main className="w-full py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 rounded">
        {/* Hero Image */}
        {event.image && (
          <div className="w-full mb-8">
            <SanityImage
              image={event.image}
              alt={event.title || "Evenemang"}
              className="w-full h-auto rounded"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
          </div>
        )}

        {/* Event Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        
          {event.title}
        </h1>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Date and Time */}
          {(eventDate || eventTime) && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Datum och tid</p>
              <div className="flex justify-between items-baseline">
                <span className="text-base font-medium">{eventDate}</span>
                {eventTime && (
                  <span className="text-base font-medium">{eventTime}</span>
                )}
              </div>
            </div>
          )}

          {/* Address */}
          {address && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Adress</p>
              <p className="text-base">{address}</p>
            </div>
          )}

          {/* Separator */}
          {(event.description || event.registrationUrl) && (
            <div className="border-t border-gray-300"></div>
          )}

          {/* Event Description */}
          {event.description && (
            <div className="prose prose-neutral max-w-none">
              <PortableText value={event.description} components={portableTextComponents} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 items-center pt-4">
            {event.registrationUrl && (
              <Button
                asChild
                variant="default"
                size="lg"
              >
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Reservera plats
                </a>
              </Button>
            )}
            <a
              href={calendarLink}
              download={calendarFilename(cleanInvisibleUnicode(event.title) ?? "evenemang")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              Lägg till i kalender
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
