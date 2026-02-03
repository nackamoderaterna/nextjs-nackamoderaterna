import { NewsListing } from "@/app/(app)/nyheter/NewsListing";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import type { ListingPage } from "@/lib/types/pages";
import { sanityClient } from "@/lib/sanity/client";
import { listingPageByKeyQuery } from "@/lib/queries/pages";

export async function generateMetadata(): Promise<Metadata> {
  const listing = await sanityClient.fetch<ListingPage>(
    listingPageByKeyQuery,
    { key: "news" }
  );

  const title =
    listing?.seo?.title || listing?.title || "Nyheter | Nackamoderaterna";
  const description =
    listing?.seo?.description ||
    "Läs de senaste nyheterna från Nackamoderaterna";

  return buildMetadata({
    title,
    description,
    url: "/nyheter",
  });
}

export const revalidate = 300;

interface NewsPageProps {
  searchParams: Promise<{ page?: string; area?: string; type?: string }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const area = params.area || null;
  const type = params.type || null;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));

  return (
    <NewsListing areaSlug={area} typeParam={type} currentPage={currentPage} />
  );
}
