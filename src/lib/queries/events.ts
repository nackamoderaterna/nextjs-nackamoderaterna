import { groq } from "next-sanity";

export const eventTypesQuery = groq`
  *[_type == "eventType"] | order(name asc) { _id, name, slug, color }
`;

export const upcomingEventsQuery = groq`
  *[_type == "event" && startDate >= now()]
  | order(startDate asc) {
    _id,
    title,
    slug,
    startDate,
    endDate,
    image{ ..., hotspot, crop },
    location,
    eventType->{ _id, name, slug, color }
  }
`;

export const allEventsQuery = groq`
  *[_type == "event"]
  | order(startDate asc) {
    _id,
    title,
    slug,
    startDate,
    endDate,
    image{ ..., hotspot, crop },
    location,
    eventType->{ _id, name, slug, color },
    isPublic
  }
`;

export const upcomingEventsPaginatedQuery = groq`{
  "items": *[_type == "event" && startDate >= now()]
  | order(startDate asc)[$start...$end] {
    _id,
    title,
    slug,
    startDate,
    endDate,
    image{ ..., hotspot, crop },
    location,
    eventType->{ _id, name, slug, color },
    isPublic
  },
  "total": count(*[_type == "event" && startDate >= now()])
}`;

export const pastEventsPaginatedQuery = groq`{
  "items": *[_type == "event" && startDate < now()]
  | order(startDate desc)[$start...$end] {
    _id,
    title,
    slug,
    startDate,
    endDate,
    image{ ..., hotspot, crop },
    location,
    eventType->{ _id, name, slug, color },
    isPublic
  },
  "total": count(*[_type == "event" && startDate < now()])
}`;

export const upcomingEventsPaginatedFilteredQuery = groq`{
  "items": *[_type == "event" && startDate >= now() && eventType->slug.current == $eventTypeSlug]
  | order(startDate asc)[$start...$end] {
    _id,
    title,
    slug,
    startDate,
    endDate,
    image{ ..., hotspot, crop },
    location,
    eventType->{ _id, name, slug, color },
    isPublic
  },
  "total": count(*[_type == "event" && startDate >= now() && eventType->slug.current == $eventTypeSlug])
}`;

export const pastEventsPaginatedFilteredQuery = groq`{
  "items": *[_type == "event" && startDate < now() && eventType->slug.current == $eventTypeSlug]
  | order(startDate desc)[$start...$end] {
    _id,
    title,
    slug,
    startDate,
    endDate,
    image{ ..., hotspot, crop },
    location,
    eventType->{ _id, name, slug, color },
    isPublic
  },
  "total": count(*[_type == "event" && startDate < now() && eventType->slug.current == $eventTypeSlug])
}`;

const eventProjection = `{
  _id,
  title,
  slug,
  startDate,
  endDate,
  image{ ..., hotspot, crop },
  location,
  eventType->{ _id, name, slug, color },
  isPublic,
  registrationUrl,
  "plainDescription": pt::text(description)
}`;

/**
 * Build a paginated events query with optional type and public filters.
 */
export function buildPaginatedEventsQuery(
  direction: "upcoming" | "past",
  options?: { typeFilter?: boolean; publicOnly?: boolean }
): string {
  const timeCondition =
    direction === "upcoming" ? "startDate >= now()" : "startDate < now()";
  const order =
    direction === "upcoming" ? "startDate asc" : "startDate desc";
  const typeCondition = options?.typeFilter
    ? " && eventType->slug.current == $eventTypeSlug"
    : "";
  const publicCondition = options?.publicOnly ? " && isPublic == true" : "";

  const filter = `_type == "event" && ${timeCondition}${typeCondition}${publicCondition}`;

  return `{
  "items": *[${filter}]
  | order(${order})[$start...$end] ${eventProjection},
  "total": count(*[${filter}])
}`;
}

/**
 * Build a query to fetch upcoming events from today with a $limit, no month constraint.
 * Returns { items, total }.
 */
export function buildUpcomingEventsQuery(options?: {
  typeFilter?: boolean;
  publicOnly?: boolean;
}): string {
  const typeCondition = options?.typeFilter
    ? " && eventType->slug.current == $eventTypeSlug"
    : "";
  const publicCondition = options?.publicOnly ? " && isPublic == true" : "";

  const filter = `_type == "event" && startDate >= now()${typeCondition}${publicCondition}`;

  return `{
  "items": *[${filter}] | order(startDate asc) [0...$limit] ${eventProjection},
  "total": count(*[${filter}])
}`;
}

/**
 * Build a query to fetch all events within a month range, with optional filters.
 */
export function buildMonthEventsQuery(options?: {
  typeFilter?: boolean;
  publicOnly?: boolean;
}): string {
  const typeCondition = options?.typeFilter
    ? " && eventType->slug.current == $eventTypeSlug"
    : "";
  const publicCondition = options?.publicOnly ? " && isPublic == true" : "";

  const filter = `_type == "event" && startDate >= $monthStart && startDate <= $monthEnd${typeCondition}${publicCondition}`;

  return `*[${filter}] | order(startDate asc) ${eventProjection}`;
}

// Query to get all event slugs for static generation
export const allEventSlugsQuery = groq`*[_type == "event" && defined(slug.current)] {
  "slug": slug.current
}`;

export const singleEventQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    startDate,
    endDate,
    description,
    image{ ..., hotspot, crop },
    location,
    eventType->{ _id, name, slug, color },
    registrationUrl,
    isPublic
  }
`;
