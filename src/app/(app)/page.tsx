import { PageBuilder } from "@/lib/components/PageBuilder";
import { sanityClient, REVALIDATE_TIME } from "@/lib/sanity/client";
import { pageBySlugQuery } from "@/lib/queries/pages";
import { generateMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Nackamoderaterna",
  description: "Moderaterna i Nacka - För ett starkare Nacka",
  url: "/",
});

export const revalidate = 300;

async function getPageBySlug(slug: string) {
  return await sanityClient.fetch(
    pageBySlugQuery,
    { slug },
    {
      next: { revalidate: REVALIDATE_TIME },
    }
  );
}

export default async function Home() {
  const page = await getPageBySlug("example");
  
  if (!page) {
    return (
      <div className="w-full mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Sidan kunde inte hittas.</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <PageBuilder blocks={page.blocks || []} />
    </div>
  );
}
