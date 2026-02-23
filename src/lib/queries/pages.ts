import { groq } from "next-sanity";

export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  pageHeader{
    header,
    description,
    image{
      ...,
      hotspot,
      crop,
      "url": asset->url
    },
    imageHeight,
    overlayOpacity,
    ctaButton{
      label,
      href,
      icon{ name }
    }
  },
  seo{
    title,
    description,
    keywords,
    image{
      ...,
      hotspot,
      crop,
      "url": asset->url
    }
  },
  pageModal{
    enabled,
    onLoadDelayMs,
    frequency,
    storageKey,
    title,
    content,
    primaryButton{
      label,
      href
    },
    secondaryButton{
      label,
      href
    }
  },
  blocks[] {
    ...,
    // POLITICAN START
    _type == "block.politician" => {
      mode,
      "items": select(
        mode == "kommunalrad" =>
          *[_type == "politician" && kommunalrad.active == true] | order(name asc){
            _id,
            name,
            slug,
            image{ ..., hotspot, crop },
            kommunalrad,
            email,
            phone,
            "livingArea": livingArea->{ _id, name, slug }
          },
        items[] {
          "politician": politician->{
            _id,
            name,
            slug,
            image{ ..., hotspot, crop },
            kommunalrad,
            email,
            phone,
            "livingArea": livingArea->{ _id, name, slug }
          },
          titleOverride
        }
      )
    },
    // POLITICIAN END
    // NEWS START
    _type == "block.news" => {
    heading{ title, subtitle },
    viewAllLink,
    mode,
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
        hotspot,
        crop,
        "url": asset->url
      }
    },

    // Resolved items depending on mode (limit: 10)
    "resolvedItems": select(
      // MANUAL
      mode == "manual" => (items[]->{
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
          hotspot,
          crop,
          "url": asset->url
        }
      })[0...10],

      // LATEST
      mode == "latest" => *[_type == "news"]
        | order(coalesce(dateOverride, publishedAt) desc)
        [0...10]{
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
            hotspot,
            crop,
            "url": asset->url
          }
        },

      // BY POLITICAL AREA
      mode == "byPoliticalArea" && defined(politicalArea) => *[_type == "news" && references(^.politicalArea._ref)]
        | order(coalesce(dateOverride, publishedAt) desc)
        [0...10]{
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
            hotspot,
            crop,
            "url": asset->url
          }
        },

      // BY GEOGRAPHIC AREA
      mode == "byGeographicArea" && defined(geographicArea) => *[_type == "news" && references(^.geographicArea._ref)]
        | order(coalesce(dateOverride, publishedAt) desc)
        [0...10]{
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
            hotspot,
            crop,
            "url": asset->url
          }
        },

      // DEFAULT → empty array
       *[_type == "news"]
        | order(coalesce(dateOverride, publishedAt) desc)
        [0...10]{
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
            hotspot,
            crop
          }
        },
    )
  },
    // IMAGE GALLERY START
    _type == "block.imageGallery" => {
      heading{ title, subtitle },
      columns,
      aspectRatio,
      images[]{
        _key,
        asset,
        "dimensions": asset->metadata.dimensions,
        alt,
        caption,
        aspectRatio,
        hotspot,
        crop
      }
    },
    // IMAGE GALLERY END
    // POLITICAL AREAS START
    _type == "block.politicalAreas" => {
      heading{ title, subtitle },
      "items": items[]->{
        _id,
        name,
        slug,
        icon{ name }
      }
    },
    // POLITICAL AREAS END
    // GEOGRAPHICAL AREAS START
    _type == "block.geographicalAreas" => {
      heading{ title, subtitle },
      "items": items[]->{
        _id,
        name,
        slug,
        image{ ..., hotspot, crop }
      }
    },
    // GEOGRAPHICAL AREAS END
    // POLITICAL ISSUES START
    _type == "block.politicalIssues" => {
      heading{ title, subtitle },
      mode,
      politicalArea,
      filter,
      limit,
      "items": items[]->{
        _id,
        question,
        description,
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
      }
    },
    // POLITICAL ISSUES END
  }
}`;

// Query to get all page slugs for static generation
export const allPageSlugsQuery = groq`*[_type == "page" && defined(slug.current)] {
  "slug": slug.current
}`;

export const listingPageByKeyQuery = groq`*[_type == "listingPage" && key == $key][0]{
  _id,
  key,
  title,
  intro,
  sectionTitles,
  seo{
    title,
    description,
    image{
      ...,
      hotspot,
      crop,
      "url": asset->url
    }
  }
}`;
