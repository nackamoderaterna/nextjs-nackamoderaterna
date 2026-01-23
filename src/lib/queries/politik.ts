import { groq } from "next-sanity";

export const politikPageQuery = groq`
{
  "featuredPoliticalIssues": *[
    _type == "politicalIssue" &&
    featured == true
  ]{
    _id,
    question,
    featured,

    "politicalAreas": politicalAreas[]->{
      _id,
      name,
      slug
    },

    "geographicalAreas": geographicalAreas[]->{
      _id,
      name,
      slug
    }
  },

  "politicalAreas": *[_type == "politicalArea"]{
    _id,
    name,
    slug,
    description,
    image
  },

  "geographicalAreas": *[_type == "geographicalArea"]{
    _id,
    name,
    slug,
    description,
    image
  }
}
`;

export const politicalAreaPageQuery = groq`
  *[_type == "politicalArea" && slug.current == $slug][0] {
    _id,
    _type,
    name,
    slug,
    description,
    image,

    "latestNews": *[
      _type == "news" &&
      references(^._id)
    ] | order(
      coalesce(dateOverride, _createdAt) desc
    )[0...4] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      dateOverride,
      _createdAt
    },

    "politicalIssues": *[
      _type == "politicalIssue" &&
      references(^._id)
    ] {
      _id,
      question,
      featured
    },
    "politicians": *[
      _type == "politician" &&
      count(politicalAreas[showOnPoliticalAreaPage == true && politicalArea._ref == ^._id]) > 0
    ] {
      _id,
      name,
      slug,
      image
    }
  }
`;
