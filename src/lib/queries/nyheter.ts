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
