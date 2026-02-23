import { groq } from "next-sanity";

export const newsQuery = groq`
*[
  _type == "news" &&
  slug.current == $slug
][0]{
  ...,
  "effectiveDate": coalesce(dateOverride, _createdAt),

  "documents": documents[]{
    title,
    "url": file.asset->url,
    "originalFilename": file.asset->originalFilename
  },

  "referencedPoliticians": referencedPolitician[]->{
    _id,
    name,
    slug,
    image{ ..., hotspot, crop }
  },

  "politicalAreas": politicalAreas[]->{
    _id,
    name,
    slug,
    icon{ name }
  },

  "geographicalAreas": geographicalAreas[]->{
    _id,
    name,
    slug,
    image{ ..., hotspot, crop }
  },

  "politicalIssues": politicalIssues[]->{
    _id,
    question,
    slug
  },

  "series": articleSeries->{
    _id,
    title,
    slug,
    description
  },
  "seriesNews": *[
    _type == "news"
    && defined(^.articleSeries._ref)
    && references(^.articleSeries._ref)
  ] | order(coalesce(dateOverride, _createdAt) desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage{ ..., hotspot, crop },
    "effectiveDate": coalesce(dateOverride, _createdAt)
  },

  "relatedByPoliticalArea": *[
    _type == "news"
    && defined(^.politicalAreas[0]._ref)
    && references(^.politicalAreas[0]._ref)
    && slug.current != ^.slug.current
  ] | order(coalesce(dateOverride, _createdAt) desc)[0...4] {
    _id,
    title,
    slug,
    excerpt,
    mainImage{ ..., hotspot, crop },
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
  mainImage{ ..., hotspot, crop },
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

// Query to get all news slugs for static generation
export const allNewsSlugsQuery = groq`*[_type == "news" && defined(slug.current)] {
  "slug": slug.current,
  "lastModified": _updatedAt
}`;

export const newsListPaginatedQuery = groq`{
  "items": *[
    _type == "news"
    && ($areaSlug == null || $areaSlug == "" || $areaSlug in politicalAreas[]->slug.current)
    && ($variant == null || variant == $variant)
  ] | order(
    coalesce(dateOverride, _createdAt) desc
  )[$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    mainImage{ ..., hotspot, crop },
    variant,
    _createdAt,
    _updatedAt,
    dateOverride,
    _rev,
    "effectiveDate": coalesce(dateOverride, _createdAt),
    "politicalAreas": politicalAreas[]-> {
      _id,
      name,
      slug,
      icon{ name }
    },
    "series": articleSeries->{
      _id,
      title,
      slug
    }
  },
  "total": count(*[
    _type == "news"
    && ($areaSlug == null || $areaSlug == "" || $areaSlug in politicalAreas[]->slug.current)
    && ($variant == null || variant == $variant)
  ])
}`;

export const allPoliticalAreasQuery = groq`
  *[_type == "politicalArea"] | order(name asc) {
    _id,
    name,
    slug,
    title,
    icon{ name }
  }
`;
