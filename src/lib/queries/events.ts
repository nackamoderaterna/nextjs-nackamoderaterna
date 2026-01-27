import { groq } from "next-sanity";

export const upcomingEventsQuery = groq`
  *[_type == "event" && startDate >= now()]
  | order(startDate asc) {
    _id,
    title,
    slug,
    startDate,
    endDate,
    image,
    location,
    eventType
  }
`;

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
    image,
    location,
    eventType,
    registrationUrl,
    isPublic
  }
`;
