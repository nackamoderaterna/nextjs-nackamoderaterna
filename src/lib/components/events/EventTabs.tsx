"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/lib/components/ui/tabs";
import { Button } from "@/lib/components/ui/button";
import { EventCard } from "@/lib/components/events/eventCard";
import { ResponsiveGrid } from "@/lib/components/shared/ResponsiveGrid";
import { sanityClient } from "@/lib/sanity/client";
import { buildPaginatedEventsQuery } from "@/lib/queries/events";
import { formatTimeRange, formatAddress } from "@/lib/utils/dateUtils";
import { ChevronDown, Loader2 } from "lucide-react";
import type { Event } from "~/sanity.types";

const PAGE_SIZE = 9;

interface EventTypeDoc {
  _id: string;
  name: string;
  slug: { current: string };
  color?: string;
}

interface EventTabsProps {
  initialUpcoming: Event[];
  upcomingTotal: number;
  initialPast: Event[];
  pastTotal: number;
  typeSlug?: string;
  publicOnly?: boolean;
}

function EventGrid({
  events,
  muted,
}: {
  events: Event[];
  muted?: boolean;
}) {
  if (events.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-8">
        {muted ? "Inga tidigare evenemang hittades." : "Inga kommande evenemang hittades."}
      </p>
    );
  }

  return (
    <ResponsiveGrid cols={3} gap="large">
      {events.map((event) => {
        const date = event.startDate ? new Date(event.startDate) : null;
        const day = date ? String(date.getDate()) : "";
        const months = [
          "Januari", "Februari", "Mars", "April", "Maj", "Juni",
          "Juli", "Augusti", "September", "Oktober", "November", "December",
        ];
        const month = date ? months[date.getMonth()] : "";
        const time = event.startDate
          ? formatTimeRange(event.startDate, event.endDate ?? undefined)
          : "";
        const location = formatAddress(event.location ?? undefined);
        const eventType = event.eventType as unknown as EventTypeDoc | null;
        const description = (event as Event & { plainDescription?: string }).plainDescription;
        const registrationUrl = (event as Event & { registrationUrl?: string }).registrationUrl;

        return (
          <EventCard
            key={event._id}
            day={day}
            month={month}
            title={event.title || ""}
            time={time}
            location={location}
            href={event.slug?.current || ""}
            isPublic={event.isPublic ?? false}
            muted={muted}
            eventTypeName={eventType?.name}
            eventTypeColor={eventType?.color}
            description={description}
            registrationUrl={registrationUrl}
          />
        );
      })}
    </ResponsiveGrid>
  );
}

export function EventTabs({
  initialUpcoming,
  upcomingTotal,
  initialPast,
  pastTotal,
  typeSlug,
  publicOnly,
}: EventTabsProps) {
  const [upcoming, setUpcoming] = useState(initialUpcoming);
  const [past, setPast] = useState(initialPast);
  const [upTotal, setUpTotal] = useState(upcomingTotal);
  const [pTotal, setPTotal] = useState(pastTotal);
  const [loadingUp, setLoadingUp] = useState(false);
  const [loadingPast, setLoadingPast] = useState(false);

  async function loadMore(direction: "upcoming" | "past") {
    const isUpcoming = direction === "upcoming";
    const currentList = isUpcoming ? upcoming : past;
    const setList = isUpcoming ? setUpcoming : setPast;
    const setTotal = isUpcoming ? setUpTotal : setPTotal;
    const setLoading = isUpcoming ? setLoadingUp : setLoadingPast;

    setLoading(true);
    try {
      const start = currentList.length;
      const end = start + PAGE_SIZE;
      const query = buildPaginatedEventsQuery(direction, {
        typeFilter: !!typeSlug,
        publicOnly,
      });
      const params: Record<string, unknown> = { start, end };
      if (typeSlug) params.eventTypeSlug = typeSlug;

      const data = await sanityClient.fetch<{ items: Event[]; total: number }>(
        query,
        params,
      );
      setList((prev) => [...prev, ...(data.items || [])]);
      setTotal(data.total);
    } catch {
      // keep existing events on error
    } finally {
      setLoading(false);
    }
  }

  const hasMoreUpcoming = upcoming.length < upTotal;
  const hasMorePast = past.length < pTotal;

  return (
    <Tabs defaultValue="kommande">
      <TabsList variant="line" className="mb-8">
        <TabsTrigger value="kommande">
          Kommande {upTotal > 0 && <span className="text-muted-foreground ml-1">({upTotal})</span>}
        </TabsTrigger>
        <TabsTrigger value="tidigare">
          Tidigare {pTotal > 0 && <span className="text-muted-foreground ml-1">({pTotal})</span>}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="kommande">
        <EventGrid events={upcoming} />
        {hasMoreUpcoming && (
          <div className="flex justify-center pt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => loadMore("upcoming")}
              disabled={loadingUp}
              className="gap-2"
            >
              {loadingUp ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Laddar...
                </>
              ) : (
                <>
                  Visa fler
                  <ChevronDown className="size-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="tidigare">
        <EventGrid events={past} muted />
        {hasMorePast && (
          <div className="flex justify-center pt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => loadMore("past")}
              disabled={loadingPast}
              className="gap-2"
            >
              {loadingPast ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Laddar...
                </>
              ) : (
                <>
                  Visa fler
                  <ChevronDown className="size-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
