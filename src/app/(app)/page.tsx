import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageBuilder } from "@/lib/components/PageBuilder";
import { PageHeader } from "@/lib/components/shared/PageHeader";
import { PageModal } from "@/lib/components/shared/PageModal";
import { pageBySlugQuery } from "@/lib/queries/pages";
import { globalSettingsQuery } from "@/lib/queries/globalSettings";
import type { GlobalSettingsData } from "@/lib/queries/globalSettings";
import { sanityClient } from "@/lib/sanity/client";
import { buildImageUrl } from "@/lib/sanity/image";
import { generatePageMetadata } from "@/lib/utils/pageSeo";
import type { PageData } from "@/lib/types/pages";

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
  const [page, settings] = await Promise.all([
    sanityClient.fetch<PageData>(
      pageBySlugQuery,
      { slug: "hem" },
      { next: { revalidate: 86400 } },
    ),
    sanityClient.fetch<GlobalSettingsData>(
      globalSettingsQuery,
      {},
      { next: { revalidate: 86400 } },
    ),
  ]);

  if (!page) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nackamoderaterna.se";

  const sameAs = settings
    ? [
        settings.socialLinks?.facebook,
        settings.socialLinks?.twitter,
        settings.socialLinks?.instagram,
        settings.socialLinks?.linkedin,
        settings.socialLinks?.tiktok,
      ].filter(Boolean)
    : [];

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.companyName ?? "Nackamoderaterna",
    url: siteUrl,
    ...(settings?.logo && { logo: buildImageUrl(settings.logo, { width: 512 }) }),
    ...(settings?.contactInfo?.email && { email: settings.contactInfo.email }),
    ...(settings?.contactInfo?.phone && { telephone: settings.contactInfo.phone }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageModal
        modal={page.pageModal}
        pageSlug={page.slug?.current || "hem"}
      />
      <PageHeader
        title={page.title ?? undefined}
        pageHeader={page.pageHeader ?? undefined}
      />
      <PageBuilder blocks={page.blocks || []} />
    </>
  );
}
