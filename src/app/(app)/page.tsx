import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageBuilder } from "@/lib/components/PageBuilder";
import { PageModal } from "@/lib/components/shared/PageModal";
import { pageBySlugQuery } from "@/lib/queries/pages";
import { sanityClient, REVALIDATE_TIME } from "@/lib/sanity/client";
import { generatePageMetadata } from "@/lib/utils/pageSeo";

export const revalidate = 300;

type PageData = {
  title?: string;
  slug?: { current?: string };
  description?: string;
  blocks?: any[];
  pageModal?: any;
  seo?: any;
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityClient.fetch<PageData>(
    pageBySlugQuery,
    { slug: "hem" },
    { next: { revalidate: REVALIDATE_TIME } }
  );

  return generatePageMetadata(page, "Nackamoderaterna");
}

export default async function Home() {
  const page = await sanityClient.fetch<PageData>(
    pageBySlugQuery,
    { slug: "hem" },
    {
      next: { revalidate: REVALIDATE_TIME },
    }
  );

  if (!page) {
    notFound();
  }

  return (
    <div className="w-full mx-auto">
      <PageModal modal={page.pageModal} pageSlug={page.slug?.current || "hem"} />
      <PageBuilder blocks={page.blocks || []} />
    </div>
  );
}
