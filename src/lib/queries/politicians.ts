import { groq } from "next-sanity";

// Query to get all politician slugs for static generation
export const allPoliticianSlugsQuery = groq`*[_type == "politician" && defined(slug.current)] {
  "slug": slug.current,
  "lastModified": _updatedAt
}`;

export const politicianBySlugQuery = groq`*[_type == "politician" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  image{ ..., hotspot, crop },
  email,
  phone,
  bio,
  kommunalrad,
  partyBoard,
  kommunfullmaktige,
  "namndPositions": namndPositions[] {
    title,
    isLeader,
    "namnd": namndRef-> {
      _id,
      title,
      slug
    }
  },
  "livingArea": livingArea-> {
    _id,
    name,
    slug,
  },
  "politicalAreas": politicalAreas[] {
    showOnPoliticalAreaPage,
    "politicalArea": politicalArea-> {
      _id,
      name,
      slug,
      icon{ name }
    }
  },
  socialLinks,
  pressbilder,
  "referencedInNews": *[_type == "news" && references(^._id)]
    | order(coalesce(dateOverride, _createdAt) desc)[0...10] {
    _id,
    title,
    slug,
    _createdAt,
    dateOverride,
    excerpt,
    "effectiveDate": coalesce(dateOverride, _createdAt),
  }
}`;
