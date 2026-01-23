import { PageBuilder } from "@/lib/components/PageBuilder";
import { PageModal } from "@/lib/components/shared/PageModal";
import { sanityClient, REVALIDATE_TIME } from "@/lib/sanity/client";
import { pageBySlugQuery } from "@/lib/queries/pages";
import { generatePageMetadata } from "@/lib/utils/pageSeo";
import { Metadata } from "next";

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

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("hem");
  return generatePageMetadata(page, "Nackamoderaterna");
}

export default async function Home() {
  const page = await getPageBySlug("hem");
  
  if (!page) {
    return (
      <div className="w-full mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Sidan kunde inte hittas.</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <PageModal modal={page.pageModal} pageSlug={page.slug?.current || "home"} />
      <PageBuilder blocks={page.blocks || []} />
    </div>
  );
}
