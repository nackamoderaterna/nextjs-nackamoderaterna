import { sanityClient } from "@/sanity/client";
import { SanityDocument } from "next-sanity";
import { PageBuilder } from "./components/PageBuilder";

const PAGE_QUERY = `*[
  _type == "page"
  && slug.current == "example" {
    _id,
    title,
    slug,
    blocks
  }
]`;

async function getPageBySlug(slug: string) {
  const query = `*[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    blocks
  }`;

  return await sanityClient.fetch(query, { slug });
}

export default async function Home() {
  const page = await getPageBySlug("example");
  return (
    <div>
      <h1>{page.title}</h1>
      <PageBuilder blocks={page.blocks} />
    </div>
  );
}
