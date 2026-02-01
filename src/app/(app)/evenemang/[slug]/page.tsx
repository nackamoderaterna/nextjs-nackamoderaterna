import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import { singleEventQuery, allEventSlugsQuery } from "@/lib/queries/events";
import { portableTextComponents } from "@/lib/components/shared/PortableTextComponents";
import { Event } from "~/sanity.types";
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
import { ContentHero } from "@/lib/components/shared/ContentHero";
import { ContentWithSidebar } from "@/lib/components/shared/ContentWithSidebar";
import { Sidebar } from "@/lib/components/shared/Sidebar";
import { SetBreadcrumbTitle } from "@/lib/components/shared/BreadcrumbTitleContext";

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

  const mainContent =
    event.description && event.description.length > 0 ? (
      <div className="prose md:prose-lg max-w-none">
        <PortableText
          value={event.description}
          components={portableTextComponents}
        />
      </div>
    ) : null;

  const hasMetadata = eventDate || eventTime || address;
  const sidebarContent = (
    <div className="grid gap-4">
      {hasMetadata && (
        <Sidebar heading="Information">
          <div className="space-y-4 text-sm">
            {(eventDate || eventTime) && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Datum och tid
                </p>
                <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                  {eventDate && (
                    <span className="font-medium text-foreground">
                      {eventDate}
                    </span>
                  )}
                  {eventTime && (
                    <span className="font-medium text-foreground">
                      {eventTime}
                    </span>
                  )}
                </div>
              </div>
            )}
            {address && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Adress
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanInvisibleUnicode(address))}}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary hover:underline transition-colors"
                >
                  {address}
                </a>
              </div>
            )}
          </div>
        </Sidebar>
      )}
      <div className="flex flex-col gap-2">
        {event.registrationUrl && (
          <Button asChild variant="default" className="w-full" size="lg">
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Reservera plats
            </a>
          </Button>
        )}
        <Button asChild variant="secondary" className="w-full" size="lg">
          <a
            href={calendarLink}
            download={calendarFilename(
              cleanInvisibleUnicode(event.title) ?? "evenemang"
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Lägg till i kalender
          </a>
        </Button>
      </div>
    </div>
  );

  return (
    <main className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SetBreadcrumbTitle title={event.title ?? "Evenemang"} />
        <ContentHero
          pageType="Evenemang"
          title={event.title ?? "Evenemang"}
          image={event.image ?? undefined}
          subtitle={event.isPublic ? "Publikt" : undefined}
        />
        <ContentWithSidebar
          mainContent={mainContent}
          sidebarContent={sidebarContent}
        />
      </div>
    </main>
  );
}
