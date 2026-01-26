import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageBuilder } from "@/lib/components/PageBuilder";
import { PageModal } from "@/lib/components/shared/PageModal";
import { pageBySlugQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { generatePageMetadata } from "@/lib/utils/pageSeo";

export const revalidate = 300;

type PageData = {
  title?: string;
  slug?: { current?: string };
  blocks?: any[];
  pageModal?: any;
  seo?: any;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await sanityClient.fetch<PageData>(
    pageBySlugQuery,
    { slug },
    { next: { revalidate: 300 } }
  );

  return generatePageMetadata(page, "Sidan hittades inte");
}

export default async function SanityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await sanityClient.fetch<PageData>(
    pageBySlugQuery,
    { slug },
    {
      next: { revalidate: 300 },
    }
  );

  if (!page) {
    notFound();
  }

  return (
    <div className="w-full mx-auto">
      <PageModal modal={page.pageModal} pageSlug={page.slug?.current || slug} />
      <PageBuilder blocks={page.blocks || []} />
    </div>
  );
}

