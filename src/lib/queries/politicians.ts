import { groq } from "next-sanity";

export const politicianBySlugQuery = groq`*[_type == "politician" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  image,
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
      slug
    }
  },
  socialMedia,
  "referencedInNews": *[_type == "news" && references(^._id)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    _createdAt,
    dateOverride,
    excerpt,
  }
}`;
