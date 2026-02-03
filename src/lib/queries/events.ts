import { groq } from "next-sanity";

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
    eventType
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
    eventType,
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
    eventType,
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
    eventType,
    isPublic
  },
  "total": count(*[_type == "event" && startDate < now()])
}`;

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
    eventType,
    registrationUrl,
    isPublic
  }
`;
