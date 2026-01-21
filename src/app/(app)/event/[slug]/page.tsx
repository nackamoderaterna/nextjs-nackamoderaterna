import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { sanityClient, REVALIDATE_TIME } from "@/lib/sanity/client";
import { singleEventQuery } from "@/lib/queries/events";
import { Event } from "~/sanity.types";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { formatDateRange } from "@/lib/utils/dateUtils";
import { generateMetadata as generateSEOMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { buildImageUrl } from "@/lib/sanity/image";

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
    url: `/event/${slug}`,
    type: "article",
  });
}

export const dynamic = "force-dynamic";
export const revalidate = REVALIDATE_TIME;

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event: Event | null = await sanityClient.fetch(
    singleEventQuery,
    { slug },
    {
      next: { revalidate: REVALIDATE_TIME },
    }
  );

  if (!event) notFound();

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="space-y-6">
        <header className="space-y-2">
          <time className="text-sm text-gray-500" dateTime={event.startDate || undefined}>
            {formatDateRange(event.startDate || new Date(), event.endDate)}
          </time>

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
            <SanityImage
              image={event.image}
              alt={event.title || "Evenemang"}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
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
