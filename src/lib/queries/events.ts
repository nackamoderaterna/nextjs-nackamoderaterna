import { groq } from "next-sanity";

export const eventTypesQuery = groq`
  *[_type == "eventType"] | order(name asc) { _id, name, slug }
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
    eventType->{ _id, name, slug }
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
    eventType->{ _id, name, slug },
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
    eventType->{ _id, name, slug },
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
    eventType->{ _id, name, slug },
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
    eventType->{ _id, name, slug },
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
    eventType->{ _id, name, slug },
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
  eventType->{ _id, name, slug },
  isPublic
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
    eventType->{ _id, name, slug },
    registrationUrl,
    isPublic
  }
`;
