import { sanityClient } from "@/lib/sanity/client";
import { PageBuilder } from "./components/PageBuilder";

async function getPageBySlug(slug: string) {
  const query = `*[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    blocks[] {
      ...,
      _type == "block.politician" => {
        mode,
        items[]->{
          ...,
        }
      },
    }
  }`;

  return await sanityClient.fetch(query, { slug });
}

export default async function Home() {
  const page = await getPageBySlug("example");
  return (
    <div className="w-full mx-auto">
      <PageBuilder blocks={page.blocks} />
    </div>
  );
}
