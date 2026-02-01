import { groq } from "next-sanity";

export const politikPageQuery = groq`
{
  "featuredPoliticalIssues": *[
    _type == "politicalIssue" &&
    featured == true
  ]{
    _id,
    question,
    slug,
    featured,
    fulfilled,

    "politicalAreas": politicalAreas[]->{
      _id,
      name,
      slug,
      icon{ name }
    },

    "geographicalAreas": geographicalAreas[]->{
      _id,
      name,
      slug
    }
  },

  "fulfilledPoliticalIssues": *[
    _type == "politicalIssue" &&
    fulfilled == true
  ] | order(_updatedAt desc) {
    _id,
    question,
    slug,
    featured,
    fulfilled,

    "politicalAreas": politicalAreas[]->{
      _id,
      name,
      slug,
      icon{ name }
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
    image,
    icon{
      name
    }
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

// Query to get all political area slugs for static generation
export const allPoliticalAreaSlugsQuery = groq`*[_type == "politicalArea" && defined(slug.current)] {
  "slug": slug.current
}`;

// Query to get all geographical area slugs for static generation
export const allGeographicalAreaSlugsQuery = groq`*[_type == "geographicalArea" && defined(slug.current)] {
  "slug": slug.current
}`;

// Query to get all political issue slugs for static generation
export const allPoliticalIssueSlugsQuery = groq`*[_type == "politicalIssue" && defined(slug.current)] {
  "slug": slug.current
}`;

export const politicalIssuePageQuery = groq`
  *[_type == "politicalIssue" && slug.current == $slug][0] {
    _id,
    _type,
    question,
    slug,
    content,
    featured,
    fulfilled,
    fulfilledAt,

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
      image
    },

    "responsiblePoliticians": responsiblePoliticians[]->{
      _id,
      name,
      slug,
      image
    },

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
    icon{ name },

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
      slug,
      featured
    },
    "politicians": *[
      _type == "politician" &&
      count(
        politicalAreas[
          showOnPoliticalAreaPage == true && 
          defined(politicalArea) &&
          politicalArea._ref == $areaId
        ]
      ) > 0
    ] {
      _id,
      name,
      slug,
      image
    }
  }
`;

export const geographicalAreaPageQuery = groq`
  *[_type == "geographicalArea" && slug.current == $slug][0] {
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
      slug,
      featured,
      fulfilled
    },

    "politicians": *[
      _type == "politician" &&
      livingArea._ref == ^._id
    ] {
      _id,
      name,
      slug,
      image
    }
  }
`;
