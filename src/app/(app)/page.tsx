import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageBuilder } from "@/lib/components/PageBuilder";
import { PageHeader } from "@/lib/components/shared/PageHeader";
import { PageModal } from "@/lib/components/shared/PageModal";
import { pageBySlugQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { generatePageMetadata } from "@/lib/utils/pageSeo";
import type { PageData } from "@/lib/types/pages";
import { PageContainer } from "@/lib/components/shared/PageContainer";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityClient.fetch<PageData>(
    pageBySlugQuery,
    { slug: "hem" },
    { next: { revalidate: 86400 } },
  );

  return generatePageMetadata(page, "Nackamoderaterna");
}

export default async function Home() {
  const page = await sanityClient.fetch<PageData>(
    pageBySlugQuery,
    { slug: "hem" },
    {
      next: { revalidate: 86400 },
    },
  );

  if (!page) {
    notFound();
  }

  return (
    <>
      <PageModal
        modal={page.pageModal}
        pageSlug={page.slug?.current || "hem"}
      />
      <PageHeader
        title={page.title ?? undefined}
        pageHeader={page.pageHeader ?? undefined}
      />
      <PageContainer>
        <PageBuilder blocks={page.blocks || []} />
      </PageContainer>
    </>
  );
}
