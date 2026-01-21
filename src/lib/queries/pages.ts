import { groq } from "next-sanity";

export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  blocks[] {
    ...,
    // POLITICAN START
    _type == "block.politician" => {
      mode,
     "items": select(
        mode == "kommunalrad" => 
          *[_type == "politician" && kommunalrad.active == true]{
            _id,
            name,
            slug,
            image,
            kommunalrad,
            position
        },

    // default = manual selection
        items[]->{
          _id,
          name,
          slug,
          image,
          kommunalrad,
          position
        }
      )
    },
    // POLITICIAN END
    // NEWS START
    _type == "block.news" => {
    title,
    mode,
    limit,
    politicalArea,
    geographicArea,
    items[]->{
      _id,
      title,
      excerpt,
      publishedAt,
      slug,
      mainImage{
        ...,
        "url": asset->url
      }
    },

    // Resolved items depending on mode
    "resolvedItems": select(
      // MANUAL
      mode == "manual" => items[]->{
        _id,
        _publishedAt,
        title,
        excerpt,
        publishedAt,
        dateOverride,
        _createdAt,
        "effectiveDate": coalesce(dateOverride, _createdAt),
        slug,
        mainImage{
          ...,
          "url": asset->url
        }
      },

      // LATEST
      mode == "latest" => *[_type == "news"] 
        | order(coalesce(dateOverride, publishedAt) desc)
        [0...4]{
          _id,
          _createdAt,
          title,
          excerpt,
          publishedAt,
          slug,
          dateOverride,
          "effectiveDate": coalesce(dateOverride, _createdAt),
          mainImage{
            ...,
            "url": asset->url
          }
        },

      // BY POLITICAL AREA
      mode == "byPoliticalArea" && defined(politicalArea) => *[_type == "news" && references(^.politicalArea._ref)]
        | order(coalesce(dateOverride, publishedAt) desc)
        [0...4]{
          _id,
          _createdAt,
          title,
          excerpt,
          publishedAt,
          slug,
          dateOverride,
          "effectiveDate": coalesce(dateOverride, _createdAt),
          mainImage{
            ...,
            "url": asset->url
          }
        },

      // BY GEOGRAPHIC AREA
      mode == "byGeographicArea" && defined(geographicArea) => *[_type == "news" && references(^.geographicArea._ref)]
        | order(coalesce(dateOverride, publishedAt) desc)
        [0...4]{
          _id,
          _createdAt,
          title,
          excerpt,
          publishedAt,
          slug,
          dateOverride,
          "effectiveDate": coalesce(dateOverride, _createdAt),
          mainImage{
            ...,
            "url": asset->url
          }
        },

      // DEFAULT → empty array
       *[_type == "news"] 
        | order(coalesce(dateOverride, publishedAt) desc)
        [0...4]{
          _id,
          _createdAt,
          title,
          excerpt,
          publishedAt,
          slug,
          dateOverride,
          "effectiveDate": coalesce(dateOverride, _createdAt),
          mainImage
        },
    )
  }
  }
}`;
