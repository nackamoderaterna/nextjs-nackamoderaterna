"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
  addMonths,
  subMonths,
  parseISO,
} from "date-fns";
import { sv } from "date-fns/locale";
import { ChevronLeft, ChevronRight, ChevronDown, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { Badge } from "@/lib/components/ui/badge";
import { ROUTE_BASE } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { formatAddress, formatTimeRange } from "@/lib/utils/dateUtils";
import { sanityClient } from "@/lib/sanity/client";
import { buildMonthEventsQuery, buildUpcomingEventsQuery } from "@/lib/queries/events";
import type { Event } from "~/sanity.types";

const WEEKDAYS = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

const DEFAULT_EVENT_COLOR = "#0072CE";
const PAGE_SIZE = 10;

interface EventTypeDoc {
  _id: string;
  name: string;
  slug: { current: string };
  color?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function getEventsForDay(events: Event[], day: Date): Event[] {
  return events.filter((e) => {
    if (!e.startDate) return false;
    return isSameDay(parseISO(e.startDate), day);
  });
}

function getEventColor(event: Event): string {
  const et = event.eventType as unknown as EventTypeDoc | null;
  return et?.color || DEFAULT_EVENT_COLOR;
}

function getEventType(event: Event): EventTypeDoc | null {
  return event.eventType as unknown as EventTypeDoc | null;
}

/* ------------------------------------------------------------------ */
/*  Day timeline builder                                              */
/* ------------------------------------------------------------------ */

type DayTimelineEntry =
  | { kind: "hour"; hour: number }
  | { kind: "event"; event: Event };

function buildDayTimeline(events: Event[]): DayTimelineEntry[] {
  const sorted = [...events]
    .filter((e) => e.startDate)
    .sort(
      (a, b) =>
        new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime(),
    );

  if (sorted.length === 0) return [];

  const firstHour = new Date(sorted[0].startDate!).getHours();
  const lastEvent = sorted[sorted.length - 1];
  const lastHour = lastEvent.endDate
    ? new Date(lastEvent.endDate).getHours()
    : new Date(lastEvent.startDate!).getHours() + 1;

  const startHour = Math.max(0, firstHour - 1);
  const endHour = Math.min(23, lastHour + 1);

  const eventsByHour = new Map<number, Event[]>();
  for (const event of sorted) {
    const h = new Date(event.startDate!).getHours();
    if (!eventsByHour.has(h)) eventsByHour.set(h, []);
    eventsByHour.get(h)!.push(event);
  }

  const entries: DayTimelineEntry[] = [];
  for (let h = startHour; h <= endHour; h++) {
    const hourEvents = eventsByHour.get(h);
    if (hourEvents) {
      for (const event of hourEvents) {
        entries.push({ kind: "event", event });
      }
    } else {
      entries.push({ kind: "hour", hour: h });
    }
  }

  return entries;
}

/* ------------------------------------------------------------------ */
/*  Month timeline builder                                            */
/* ------------------------------------------------------------------ */

type MonthTimelineEntry =
  | { kind: "date"; label: string }
  | { kind: "event"; event: Event };

function buildMonthTimeline(events: Event[]): MonthTimelineEntry[] {
  const sorted = [...events]
    .filter((e) => e.startDate)
    .sort(
      (a, b) =>
        new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime(),
    );

  const entries: MonthTimelineEntry[] = [];
  let lastDateStr = "";

  for (const event of sorted) {
    const date = parseISO(event.startDate!);
    const dateStr = format(date, "yyyy-MM-dd");

    if (dateStr !== lastDateStr) {
      entries.push({
        kind: "date",
        label: format(date, "EEEE d MMMM", { locale: sv }),
      });
      lastDateStr = dateStr;
    }

    entries.push({ kind: "event", event });
  }

  return entries;
}

/* ------------------------------------------------------------------ */
/*  Shared timeline event item                                        */
/* ------------------------------------------------------------------ */

function TimelineEventItem({
  event,
  showTime,
}: {
  event: Event;
  showTime?: boolean;
}) {
  const eventType = getEventType(event);
  const address = formatAddress(event.location ?? undefined);
  const description = (event as Event & { plainDescription?: string })
    .plainDescription;

  return (
    <Link
      href={`${ROUTE_BASE.EVENTS}/${event.slug?.current || ""}`}
      className="block hover:bg-muted/40 transition-colors p-2 -mx-1 rounded-md"
    >
      <p className="font-semibold text-sm text-foreground truncate">
        {event.title}
      </p>
      {showTime && event.startDate && (
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatTimeRange(event.startDate, event.endDate ?? undefined)}
        </p>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {description}
        </p>
      )}
      {address && (
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{address}</span>
        </p>
      )}
      <div className="flex items-center gap-1.5 mt-1.5">
        {event.isPublic && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            Öppen
          </Badge>
        )}
        {eventType?.name && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0"
            style={
              eventType.color
                ? {
                    borderColor: eventType.color,
                    backgroundColor: `${eventType.color}15`,
                    color: eventType.color,
                  }
                : undefined
            }
          >
            {eventType.name}
          </Badge>
        )}
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Compact calendar (used inside EventSidebar)                       */
/* ------------------------------------------------------------------ */

function CompactCalendar({
  days,
  currentMonth,
  events,
  selectedDay,
  onSelectDay,
}: {
  days: Date[];
  currentMonth: Date;
  events: Event[];
  selectedDay: Date | null;
  onSelectDay: (day: Date | null) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-1 text-center text-[10px] font-medium text-muted-foreground uppercase"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);
          const dayEvents = getEventsForDay(events, day);
          const hasEvents = dayEvents.length > 0;
          const isSelected = selectedDay
            ? isSameDay(day, selectedDay)
            : false;

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => {
                if (!hasEvents) return;
                onSelectDay(isSelected ? null : day);
              }}
              className={cn(
                "relative flex flex-col items-center py-1.5 rounded transition-colors",
                !inMonth && "text-muted-foreground/30",
                inMonth && "text-foreground",
                hasEvents && "cursor-pointer hover:bg-muted/60",
                !hasEvents && "cursor-default",
                isSelected && "bg-brand-primary/10 ring-1 ring-brand-primary",
              )}
            >
              <span
                className={cn(
                  "text-xs leading-none",
                  today &&
                    "bg-brand-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]",
                )}
              >
                {format(day, "d")}
              </span>
              {hasEvents && (
                <div className="flex gap-px mt-0.5">
                  {dayEvents.slice(0, 3).map((e) => (
                    <span
                      key={e._id}
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: getEventColor(e) }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EventSidebar — compact calendar + inline day timeline              */
/* ------------------------------------------------------------------ */

export function EventSidebar() {
  const [sidebarMonth, setSidebarMonth] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [monthEvents, setMonthEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMonthEvents = useCallback(async (month: Date) => {
    setLoading(true);
    try {
      const monthStart = format(startOfMonth(month), "yyyy-MM-dd");
      const monthEnd = format(endOfMonth(month), "yyyy-MM-dd");
      const query = buildMonthEventsQuery();
      const data = await sanityClient.fetch<Event[]>(query, {
        monthStart,
        monthEnd,
      });
      setMonthEvents(data || []);
    } catch {
      setMonthEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonthEvents(sidebarMonth);
  }, [sidebarMonth, fetchMonthEvents]);

  const monthStart = startOfMonth(sidebarMonth);
  const monthEnd = endOfMonth(sidebarMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const selectedDayEvents = selectedDay
    ? getEventsForDay(monthEvents, selectedDay)
    : [];
  const dayTimeline = buildDayTimeline(selectedDayEvents);

  return (
    <div className="border border-border rounded-lg p-4 md:p-6 w-full">
      <h2 className="text-lg font-semibold text-foreground mb-3 md:mb-4 border-b border-border pb-2">
        Kalender
      </h2>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            setSelectedDay(null);
            setSidebarMonth((m) => subMonths(m, 1));
          }}
          aria-label="Föregående månad"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm font-semibold capitalize">
          {format(sidebarMonth, "LLLL yyyy", { locale: sv })}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            setSelectedDay(null);
            setSidebarMonth((m) => addMonths(m, 1));
          }}
          aria-label="Nästa månad"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* Calendar grid */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <CompactCalendar
          days={days}
          currentMonth={sidebarMonth}
          events={monthEvents}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />
      )}

      {/* Inline day timeline (below calendar, no sheet) */}
      {selectedDay && selectedDayEvents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold capitalize mb-3">
            {format(selectedDay, "EEEE d MMMM", { locale: sv })}
          </h3>
          <ol className="relative border-l border-border/60 ml-8">
            {dayTimeline.map((entry) => {
              if (entry.kind === "hour") {
                return (
                  <li
                    key={`hour-${entry.hour}`}
                    className="relative pl-5 py-3"
                  >
                    <span className="absolute -left-[3px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground/40 tabular-nums whitespace-nowrap">
                      {String(entry.hour).padStart(2, "0")}:00
                    </span>
                  </li>
                );
              }

              const color = getEventColor(entry.event);
              const startTime = entry.event.startDate
                ? format(parseISO(entry.event.startDate), "HH:mm")
                : "";

              return (
                <li
                  key={entry.event._id}
                  className="relative pl-5 pb-2"
                >
                  <span
                    className="absolute -left-[5px] top-[13px] w-2.5 h-2.5 rounded-full z-10"
                    style={{ backgroundColor: color }}
                  />
                  <span className="absolute right-full mr-3 top-[12px] text-[11px] text-muted-foreground/60 tabular-nums whitespace-nowrap">
                    {startTime}
                  </span>
                  <TimelineEventItem event={entry.event} />
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EventList — paginated month-grouped timeline (main content)       */
/* ------------------------------------------------------------------ */

interface EventListProps {
  initialEvents: Event[];
  total: number;
  typeSlug?: string;
  publicOnly?: boolean;
}

export function EventList({
  initialEvents,
  total,
  typeSlug,
  publicOnly,
}: EventListProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [currentTotal, setCurrentTotal] = useState(total);

  const timeline = buildMonthTimeline(events);
  const hasMore = events.length < currentTotal;

  async function loadMore() {
    setLoading(true);
    try {
      const newLimit = events.length + PAGE_SIZE;
      const query = buildUpcomingEventsQuery({
        typeFilter: !!typeSlug,
        publicOnly,
      });
      const params: Record<string, unknown> = { limit: newLimit };
      if (typeSlug) params.eventTypeSlug = typeSlug;

      const data = await sanityClient.fetch<{ items: Event[]; total: number }>(
        query,
        params,
      );
      setEvents(data.items || []);
      setCurrentTotal(data.total);
    } catch {
      // keep existing events on error
    } finally {
      setLoading(false);
    }
  }

  if (timeline.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-8">
        Inga kommande evenemang hittades.
      </p>
    );
  }

  return (
    <div>
      <ol className="relative border-l border-border/60 ml-4">
        {timeline.map((entry, i) => {
          if (entry.kind === "date") {
            return (
              <li
                key={`date-${i}`}
                className={cn(
                  "relative pl-6 pb-1",
                  i > 0 && "mt-5",
                )}
              >
                <span className="absolute -left-[5px] top-[5px] w-2.5 h-2.5 rounded-full bg-muted-foreground/20 z-10" />
                <p className="text-sm font-medium text-muted-foreground capitalize">
                  {entry.label}
                </p>
              </li>
            );
          }

          const color = getEventColor(entry.event);

          return (
            <li key={entry.event._id} className="relative pl-6 pb-1">
              <span
                className="absolute -left-1 top-[13px] w-2 h-2 rounded-full z-10"
                style={{ backgroundColor: color }}
              />
              <TimelineEventItem event={entry.event} showTime />
            </li>
          );
        })}
      </ol>

      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
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
    </div>
  );
}
