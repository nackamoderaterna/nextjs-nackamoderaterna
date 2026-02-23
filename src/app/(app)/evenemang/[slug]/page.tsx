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
import {
  generateMetadata as generateSEOMetadata,
  getGlobalSeoDefaults,
} from "@/lib/utils/seo";
import { Metadata } from "next";
import { buildImageUrl } from "@/lib/sanity/image";
import Link from "next/link";
import { CalendarDays, CalendarPlus, Clock, MapPin, UserPlus } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { ROUTE_BASE } from "@/lib/routes";
import { ContentHero } from "@/lib/components/shared/ContentHero";
import { PageContainer } from "@/lib/components/shared/PageContainer";
import { SetBreadcrumbTitle } from "@/lib/components/shared/BreadcrumbTitleContext";
import { portableTextToPlainText } from "@/lib/utils/portableText";

// Generate static params for all events at build time
export async function generateStaticParams() {
  const events =
    await sanityClient.fetch<{ slug: string }[]>(allEventSlugsQuery);

  return events.map((event) => ({
    slug: event.slug,
  }));
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [event, defaults] = await Promise.all([
    sanityClient.fetch<Event | null>(
      singleEventQuery,
      { slug },
      { next: { revalidate: 86400 } },
    ),
    getGlobalSeoDefaults(),
  ]);

  if (!event) {
    return generateSEOMetadata({
      title: "Evenemang hittades inte",
      description: "Det begärda evenemanget kunde inte hittas",
    });
  }

  const imageUrl = event.image
    ? buildImageUrl(event.image, { width: 1200, height: 630 })
    : defaults.image;

  const descriptionText = event.description
    ? portableTextToPlainText(event.description as unknown[], 150)
    : undefined;

  return generateSEOMetadata({
    title: `${event.title} | Nackamoderaterna`,
    description: descriptionText
      ? `${event.title} - ${descriptionText}`
      : `Läs mer om evenemanget ${event.title}`,
    image: imageUrl,
    url: `${ROUTE_BASE.EVENTS}/${slug}`,
    type: "article",
  });
}

export const revalidate = 86400;

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event: Event | null = await sanityClient.fetch(
    singleEventQuery,
    { slug },
    {
      next: { revalidate: 86400 },
    },
  );

  if (!event) notFound();

  const eventDate = event.startDate ? formatEventDate(event.startDate) : "";
  const eventTime = event.startDate
    ? formatTimeRange(event.startDate, event.endDate)
    : "";
  const address = formatAddress(event.location);
  const descriptionText = event.description
    ? event.description
        .map((b) =>
          b._type === "block" && b.children
            ? b.children
                .map((c) => (c as { text?: string }).text ?? "")
                .join("")
            : "",
        )
        .join(" ")
        .trim()
    : "";
  const calendarLink = generateCalendarLink(
    event.title ?? "Evenemang",
    event.startDate ?? new Date(),
    event.endDate ?? undefined,
    descriptionText || undefined,
    address || undefined,
  );

  const mainContent =
    event.description && event.description.length > 0 ? (
      <div className="prose md:prose-lg max-w-3xl">
        <PortableText
          value={event.description}
          components={portableTextComponents}
        />
      </div>
    ) : null;

  const mapsUrl =
    (event.location as { mapsUrl?: string } | undefined)?.mapsUrl ||
    (address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanInvisibleUnicode(address))}`
      : undefined);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nackamoderaterna.se";
  const imageUrl = event.image
    ? buildImageUrl(event.image, { width: 1200, height: 630 })
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
    url: `${siteUrl}${ROUTE_BASE.EVENTS}/${slug}`,
    image: imageUrl,
    description: descriptionText || undefined,
    location: address
      ? {
          "@type": "Place",
          name: address,
          address: address,
        }
      : undefined,
    organizer: {
      "@type": "Organization",
      name: "Nackamoderaterna",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageContainer as="main" paddingY="default">
        <SetBreadcrumbTitle title={event.title ?? "Evenemang"} />
        <ContentHero
          pageType={`Evenemang${event.isPublic ? " · Publikt" : ""}`}
          title={event.title ?? "Evenemang"}
          image={event.image ?? undefined}
          subtitle={
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                {eventDate && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-4" />
                    {eventDate}
                  </span>
                )}
                {eventTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4" />
                    {eventTime}
                  </span>
                )}
                {address && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <MapPin className="size-4" />
                    {address}
                  </a>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {event.registrationUrl && (
                  <Button asChild>
                    <Link
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <UserPlus className="size-4" />
                      Anmäl dig
                    </Link>
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <Link
                    href={calendarLink}
                    download={calendarFilename(
                      cleanInvisibleUnicode(event.title) ?? "evenemang",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CalendarPlus className="size-4" />
                    Lägg till i kalender
                  </Link>
                </Button>
                {mapsUrl && address && (
                  <Button variant="outline" asChild>
                    <Link
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="size-4" />
                      Visa på karta
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          }
        />
        {mainContent}
      </PageContainer>
    </>
  );
}
