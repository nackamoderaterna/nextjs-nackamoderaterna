import { groq } from "next-sanity";

export const searchQuery = groq`
{
  "politicians": *[_type == "politician"] {
    _id,
    _type,
    name,
    slug,
    email,
    "searchText": coalesce(name, "") + " " + coalesce(email, "")
  },
  "events": *[_type == "event"] {
    _id,
    _type,
    title,
    slug,
    startDate,
    endDate,
    location,
    description,
    "searchText": coalesce(title, "") + " " + coalesce(location, "") + " " + coalesce(description, "")
  },
  "news": *[_type == "news"] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    "searchText": coalesce(title, "") + " " + coalesce(excerpt, "")
  },
  "politicalAreas": *[_type == "politicalArea"] {
    _id,
    _type,
    name,
    slug,
    description,
    "searchText": coalesce(name, "") + " " + coalesce(description, "")
  },
  "geographicalAreas": *[_type == "geographicalArea"] {
    _id,
    _type,
    name,
    slug,
    description,
    "searchText": coalesce(name, "") + " " + coalesce(description, "")
  }
}
`;
