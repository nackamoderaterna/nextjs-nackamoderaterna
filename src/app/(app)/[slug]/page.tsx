import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageBuilder } from "@/lib/components/PageBuilder";
import { PageModal } from "@/lib/components/shared/PageModal";
import { PageHero } from "@/lib/components/shared/PageHero";
import { ListingHeader } from "@/lib/components/shared/ListingHeader";
import { pageBySlugQuery, allPageSlugsQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { generatePageMetadata } from "@/lib/utils/pageSeo";

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

type PageData = {
  title?: string;
  slug?: { current?: string };
  description?: string;
  showImageHero?: boolean;
  hero?: {
    heading?: string | null;
    subheading?: string | null;
    backgroundImage?: unknown;
    overlayOpacity?: number | null;
    ctaButton?: { label?: string | null; link?: string | null } | null;
    height?: string | null;
  } | null;
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

  const showImageHero = page.showImageHero && page.hero?.backgroundImage;
  const showTextHeader = !showImageHero;

  return (
    <div className="w-full mx-auto">
      <PageModal modal={page.pageModal} pageSlug={page.slug?.current || slug} />
      {showImageHero && page.hero ? <PageHero hero={page.hero} /> : null}
      {showTextHeader && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ListingHeader
            title={page.title ?? undefined}
            intro={typeof page.description === "string" ? page.description : undefined}
            fallbackTitle=""
          />
        </div>
      )}
      <PageBuilder blocks={page.blocks || []} />
    </div>
  );
}

