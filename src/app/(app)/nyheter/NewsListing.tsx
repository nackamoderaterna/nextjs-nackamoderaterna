import { NewsCard, type SeriesRef } from "@/lib/components/news/NewsCard";
import { Pagination } from "@/lib/components/news/Pagination";
import { NewsFilters } from "@/lib/components/news/NewsFilters";
import { sanityClient } from "@/lib/sanity/client";
import {
  newsListPaginatedQuery,
  allPoliticalAreasQuery,
} from "@/lib/queries/nyheter";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { News } from "~/sanity.types";
import type { NewsVariant } from "@/lib/types/news";
import type { ListingPage } from "@/lib/types/pages";
import { ListingPageLayout } from "@/lib/components/shared/ListingPageLayout";
import { EmptyState } from "@/lib/components/shared/EmptyState";
import { getEffectiveDate } from "@/lib/utils/getEffectiveDate";

type NewsListItem = Pick<
  News,
  | "_id"
  | "title"
  | "slug"
  | "excerpt"
  | "mainImage"
  | "_createdAt"
  | "dateOverride"
  | "_updatedAt"
  | "_rev"
> & {
  effectiveDate: string;
  variant?: NewsVariant;
  politicalAreas?: Array<{
    _id: string;
    name: string;
    slug?: { current: string } | null;
  }>;
  series?: SeriesRef | null;
};

type NewsListPaginatedResult = {
  items: NewsListItem[];
  total: number;
};

const ITEMS_PER_PAGE = 10;
const VALID_VARIANTS = ["default", "debate", "pressrelease"] as const;

export interface NewsListingProps {
  areaSlug?: string | null;
  typeParam?: string | null;
  currentPage: number;
}

export async function NewsListing({
  areaSlug,
  typeParam,
  currentPage,
}: NewsListingProps) {
  const variantFilter =
    typeParam && VALID_VARIANTS.includes(typeParam as (typeof VALID_VARIANTS)[number])
      ? (typeParam as NewsVariant)
      : null;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  const [result, politicalAreas, listing] = await Promise.all([
    sanityClient.fetch<NewsListPaginatedResult>(
      newsListPaginatedQuery,
      {
        start,
        end,
        areaSlug: areaSlug || null,
        variant: variantFilter,
      },
      { next: { revalidate: 86400 } }
    ),
    sanityClient.fetch<any[]>(allPoliticalAreasQuery, {}, { next: { revalidate: 86400 } }),
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "news" },
      { next: { revalidate: 86400 } }
    ),
  ]);

  const { items: newsList, total } = result;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const filterParams: Record<string, string> = {};
  if (areaSlug) filterParams.area = areaSlug;
  if (typeParam) filterParams.type = typeParam;

  if (currentPage > totalPages && totalPages > 0) {
    return (
      <ListingPageLayout
        title={listing?.title}
        intro={listing?.intro}
        fallbackTitle="Nyheter"
      >
        <EmptyState message="Sidan kunde inte hittas." />
      </ListingPageLayout>
    );
  }

  return (
    <ListingPageLayout
      title={listing?.title}
      intro={listing?.intro}
      fallbackTitle="Nyheter"
    >
      <NewsFilters politicalAreas={politicalAreas || []} />
      {newsList.length === 0 ? (
        <EmptyState message="Inga nyheter tillgängliga för tillfället." />
      ) : (
        <>
          <div className="grid">
            {newsList.map((news, index) => (
              <NewsCard
                key={news._id}
                title={news.title || ""}
                isLast={index === newsList.length - 1}
                date={getEffectiveDate(news)}
                slug={news.slug?.current || ""}
                excerpt={news.excerpt || ""}
                variant={news.variant}
                politicalAreas={news.politicalAreas}
                series={news.series}
                headingLevel="h2"
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            preserveParams={filterParams}
          />
        </>
      )}
    </ListingPageLayout>
  );
}
