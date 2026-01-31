import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageBuilder } from "@/lib/components/PageBuilder";
import { PageModal } from "@/lib/components/shared/PageModal";
import { PageHeader } from "@/lib/components/shared/PageHeader";
import { pageBySlugQuery, allPageSlugsQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { generatePageMetadata } from "@/lib/utils/pageSeo";
import type { PageData } from "@/lib/types/pages";

export const revalidate = 300;

// Generate static params for all pages at build time
export async function generateStaticParams() {
  const pages = await sanityClient.fetch<{ slug: string }[]>(
    allPageSlugsQuery
  );
  
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

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
      <PageHeader
        title={page.title ?? undefined}
        pageHeader={page.pageHeader ?? undefined}
      />
      <PageBuilder blocks={page.blocks || []} />
    </div>
  );
}

