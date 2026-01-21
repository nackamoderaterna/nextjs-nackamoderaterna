import { groq } from "next-sanity";

export const newsQuery = groq`
*[
  _type == "news" &&
  slug.current == $slug
][0]{
  ...,
  "effectiveDate": coalesce(dateOverride, _createdAt),

  "referencedPoliticians": referencedPolitician[]->{
    _id,
    name,
    slug,
    image
  },

  "politicalAreas": politicalAreas[]->{
    _id,
    name,
    slug
  },

  "geographicalAreas": geographicalAreas[]->{
    _id,
    name,
    slug
  },

  "relatedNews": related[]->{
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    "effectiveDate": coalesce(dateOverride, _createdAt)
  }
}
`;

export const newsListQuery = groq`*[_type == "news"] | order(
  coalesce(dateOverride, _createdAt) desc
) {
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  _createdAt,
  _updatedAt,
  dateOverride,
  _rev,
  "effectiveDate": coalesce(dateOverride, _createdAt),
  "politicalAreas": politicalAreas[]-> {
    _id,
    title
  }
}`;

export const newsListPaginatedQuery = groq`{
  "items": *[_type == "news"] | order(
    coalesce(dateOverride, _createdAt) desc
  )[$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    _createdAt,
    _updatedAt,
    dateOverride,
    _rev,
    "effectiveDate": coalesce(dateOverride, _createdAt),
    "politicalAreas": politicalAreas[]-> {
      _id,
      title
    }
  },
  "total": count(*[_type == "news"])
}`;
