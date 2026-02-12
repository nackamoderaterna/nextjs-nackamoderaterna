"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  createContext,
  useContext,
} from "react";
import Link from "next/link";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  isSameDay,
} from "date-fns";
import { sv } from "date-fns/locale";
import { getDefaultClassNames, type DayButton } from "react-day-picker";
import { ChevronDown, MapPin, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { Badge } from "@/lib/components/ui/badge";
import { Calendar } from "@/lib/components/ui/calendar";
import { ROUTE_BASE } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { formatAddress, formatTimeRange } from "@/lib/utils/dateUtils";
import { sanityClient } from "@/lib/sanity/client";
import {
  buildMonthEventsQuery,
  buildUpcomingEventsQuery,
} from "@/lib/queries/events";
import type { Event } from "~/sanity.types";

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
  const registrationUrl = (event as Event & { registrationUrl?: string })
    .registrationUrl;
  const hasActions = !!registrationUrl;

  return (
    <div className={cn(hasActions && "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2")}>
      <Link
        href={`${ROUTE_BASE.EVENTS}/${event.slug?.current || ""}`}
        className="block hover:bg-muted/40 transition-colors p-2 -mx-1 rounded-md flex flex-col gap-1 min-w-0 flex-1"
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
      {hasActions && (
        <div className="flex items-center gap-2 shrink-0 pl-2 sm:pl-0 sm:pt-2">
          <Button asChild variant="outline" size="sm">
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <UserPlus className="size-3.5" />
              Anmäl dig
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom calendar day button with event dots                        */
/* ------------------------------------------------------------------ */

const DayEventColorsContext = createContext<Map<string, string[]>>(new Map());

function EventDayButton({
  className,
  day,
  modifiers,
  children,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const dayEventColors = useContext(DayEventColorsContext);
  const defaultClassNames = getDefaultClassNames();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const dateKey = format(day.date, "yyyy-MM-dd");
  const colors = dayEventColors.get(dateKey) || [];
  const hasEvents = colors.length > 0;

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className,
        !hasEvents && !modifiers.outside && "text-muted-foreground",
      )}
      {...props}
    >
      {children}
      {hasEvents && (
        <div className="flex gap-0.5 justify-center">
          {colors.slice(0, 4).map((color, i) => (
            <span
              key={i}
              className="size-1 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/*  EventSidebar — shadcn Calendar + popover day events               */
/* ------------------------------------------------------------------ */

export function EventSidebar() {
  const [sidebarMonth, setSidebarMonth] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [monthEvents, setMonthEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMonthEvents = useCallback(async (month: Date) => {
    setLoading(true);
    try {
      const ms = format(startOfMonth(month), "yyyy-MM-dd");
      const me = format(endOfMonth(month), "yyyy-MM-dd");
      const query = buildMonthEventsQuery();
      const data = await sanityClient.fetch<Event[]>(query, {
        monthStart: ms,
        monthEnd: me,
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

  const dayEventColors = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const event of monthEvents) {
      if (!event.startDate) continue;
      const dateKey = format(parseISO(event.startDate), "yyyy-MM-dd");
      const color = getEventColor(event);
      if (!map.has(dateKey)) map.set(dateKey, []);
      const colors = map.get(dateKey)!;
      if (!colors.includes(color)) colors.push(color);
    }
    return map;
  }, [monthEvents]);

  const selectedDayEvents = selectedDay
    ? getEventsForDay(monthEvents, selectedDay)
    : [];

  return (
    <div className="w-full lg:sticky lg:top-8">
      <div className="flex justify-center">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <DayEventColorsContext.Provider value={dayEventColors}>
            <Calendar
              locale={sv}
              mode="single"
              selected={selectedDay}
              onSelect={(day) => {
                if (day && selectedDay && isSameDay(day, selectedDay)) {
                  setSelectedDay(undefined);
                } else {
                  setSelectedDay(day);
                }
              }}
              month={sidebarMonth}
              onMonthChange={(month) => {
                setSelectedDay(undefined);
                setSidebarMonth(month);
              }}
              weekStartsOn={1}
              components={{
                DayButton: EventDayButton,
              }}
            />
          </DayEventColorsContext.Provider>
        )}
      </div>

      {selectedDay && selectedDayEvents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm font-semibold capitalize mb-3">
            {format(selectedDay, "EEEE d MMMM", { locale: sv })}
          </p>
          <div className="space-y-1">
            {selectedDayEvents.map((event) => (
              <TimelineEventItem
                key={event._id}
                event={event}
                showTime
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EventList — paginated date-grouped timeline (main content)        */
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
      <ol>
        {timeline.map((entry, i) => {
          if (entry.kind === "date") {
            return (
              <li key={`date-${i}`} className={cn(i > 0 && "mt-6")}>
                <p className="text-sm font-medium text-muted-foreground capitalize pb-2 border-b border-border mb-1">
                  {entry.label}
                </p>
              </li>
            );
          }

          const color = getEventColor(entry.event);

          return (
            <li key={entry.event._id} className="relative pl-5">
              <span
                className="absolute left-0 top-[13px] w-2 h-2 rounded-full"
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
