import { groq } from "next-sanity";

export const newsQuery = groq`
*[
  _type == "news" &&
  slug.current == $slug
][0]{
  ...,
  "effectiveDate": coalesce(dateOverride, _createdAt),

  "document": document{
    ...,
    "url": asset->url,
    "originalFilename": asset->originalFilename
  },

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
  "items": *[
    _type == "news"
    && ($politicalArea == null || references($politicalArea))
    && ($variant == null || variant == $variant)
  ] | order(
    coalesce(dateOverride, _createdAt) desc
  )[$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    variant,
    _createdAt,
    _updatedAt,
    dateOverride,
    _rev,
    "effectiveDate": coalesce(dateOverride, _createdAt),
    "politicalAreas": politicalAreas[]-> {
      _id,
      title,
      slug
    }
  },
  "total": count(*[
    _type == "news"
    && ($politicalArea == null || references($politicalArea))
    && ($variant == null || variant == $variant)
  ])
}`;

export const allPoliticalAreasQuery = groq`
  *[_type == "politicalArea"] | order(name asc) {
    _id,
    name,
    slug,
    title
  }
`;
