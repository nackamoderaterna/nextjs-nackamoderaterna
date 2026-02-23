import { NewsListing } from "@/app/(app)/nyheter/NewsListing";
import { generateMetadata as buildMetadata, getGlobalSeoDefaults } from "@/lib/utils/seo";
import { Metadata } from "next";
import type { ListingPage } from "@/lib/types/pages";
import { sanityClient } from "@/lib/sanity/client";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { buildBreadcrumbJsonLd } from "@/lib/utils/breadcrumbJsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const [listing, defaults] = await Promise.all([
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "news" },
      { next: { revalidate: 86400 } }
    ),
    getGlobalSeoDefaults(),
  ]);

  const title =
    listing?.seo?.title || listing?.title || "Nyheter | Nackamoderaterna";
  const description =
    listing?.seo?.description ||
    "Läs de senaste nyheterna från Nackamoderaterna";

  return buildMetadata({
    title,
    description,
    image: listing?.seo?.image?.url ?? defaults.image,
    url: "/nyheter",
  });
}

export const revalidate = 86400;

interface NewsPageProps {
  searchParams: Promise<{ page?: string; area?: string; type?: string }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const area = params.area || null;
  const type = params.type || null;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Hem", url: "/" },
    { name: "Nyheter" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <NewsListing areaSlug={area} typeParam={type} currentPage={currentPage} />
    </>
  );
}
