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
