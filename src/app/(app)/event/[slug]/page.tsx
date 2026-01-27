import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import { singleEventQuery } from "@/lib/queries/events";
import { Event } from "~/sanity.types";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import {
  formatEventDate,
  formatTimeRange,
  formatAddress,
  generateCalendarLink,
} from "@/lib/utils/dateUtils";
import { generateMetadata as generateSEOMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { buildImageUrl } from "@/lib/sanity/image";
import { Button } from "@/components/ui/button";
import { ROUTE_BASE } from "@/lib/routes";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const event: Event | null = await sanityClient.fetch(singleEventQuery, {
    slug,
  });

  if (!event) {
    return generateSEOMetadata({
      title: "Evenemang hittades inte",
      description: "Det begärda evenemanget kunde inte hittas",
    });
  }

  const imageUrl = event.image
    ? buildImageUrl(event.image, { width: 1200, height: 630 })
    : undefined;

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
  
  // Extract plain text from PortableText description
  const extractText = (blocks: any[]): string => {
    return blocks
      .map((block) => {
        if (block._type === "block" && block.children) {
          return block.children
            .map((child: any) => child.text || "")
            .join("");
        }
        return "";
      })
      .join(" ")
      .trim();
  };
  const descriptionText = event.description
    ? extractText(event.description)
    : "";

  const calendarLink = generateCalendarLink(
    event.title || "Evenemang",
    event.startDate || new Date(),
    event.endDate,
    descriptionText,
    address
  );

  return (
    <main className="w-full py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero Image */}
        {event.image && (
          <div className="w-full mb-8">
            <SanityImage
              image={event.image}
              alt={event.title || "Evenemang"}
              className="w-full h-auto"
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
              <PortableText value={event.description} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 items-center pt-4">
            {event.registrationUrl && (
              <Button
                asChild
                variant="default"
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
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
