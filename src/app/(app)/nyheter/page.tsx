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
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import type { NewsVariant } from "@/lib/types/news";
import type { ListingPage } from "@/lib/types/pages";
import { ListingHeader } from "@/lib/components/shared/ListingHeader";
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

const VALID_VARIANTS = ["default", "debate", "pressrelease"] as const;

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const politicalAreaId = params.area || undefined;
  const typeParam = params.type;
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
        politicalArea: politicalAreaId || null,
        variant: variantFilter,
      },
      {
        next: { revalidate: 300 },
      }
    ),
    sanityClient.fetch<any[]>(allPoliticalAreasQuery, {}, {
      next: { revalidate: 300 },
    }),
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "news" },
      {
        next: { revalidate: 300 },
      }
    ),
  ]);

  const { items: newsList, total } = result;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Redirect to last page if page number is too high
  if (currentPage > totalPages && totalPages > 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ListingHeader
            title={listing?.title}
            intro={listing?.intro}
            fallbackTitle="Nyheter"
          />
          <p className="text-muted-foreground text-center py-12">
            Sidan kunde inte hittas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ListingHeader
          title={listing?.title}
          intro={listing?.intro}
          fallbackTitle="Nyheter"
        />

        <NewsFilters politicalAreas={politicalAreas || []} />

        {newsList.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            Inga nyheter tillgängliga för tillfället.
          </p>
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
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/nyheter"
              preserveParams={{
                ...(politicalAreaId && { area: politicalAreaId }),
                ...(typeParam && { type: typeParam }),
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
