import { PageBuilder } from "@/lib/components/PageBuilder";
import { sanityClient } from "@/lib/sanity/client";

async function getPageBySlug(slug: string) {
  const query = `*[_type == "page" && slug.current == $slug][0] {
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
          title,
          excerpt,
          publishedAt,
          slug,
          mainImage{
            ...,
            "url": asset->url
          }
        },

        // LATEST
        mode == "latest" => *[_type == "news"] 
          | order(publishedAt desc)
          [0...4]{
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

        // BY POLITICAL AREA
        mode == "byPoliticalArea" && defined(politicalArea) => *[_type == "news" && references(^.politicalArea._ref)]
          | order(publishedAt desc)
          [0...4]{
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

        // BY GEOGRAPHIC AREA
        mode == "byGeographicArea" && defined(geographicArea) => *[_type == "news" && references(^.geographicArea._ref)]
          | order(publishedAt desc)
          [0...4]{
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

        // DEFAULT → empty array
         *[_type == "news"] 
          | order(publishedAt desc)
          [0...4]{
            _id,
            title,
            excerpt,
            publishedAt,
            slug,
            mainImage
          },
      )
    }
    }
  }`;

  return await sanityClient.fetch(query, { slug });
}

export default async function Home() {
  const page = await getPageBySlug("example");
  return (
    <div className="w-full mx-auto">
      <PageBuilder blocks={page?.blocks} />
    </div>
  );
}
