import { PoliticalAreaCard } from "@/lib/components/politics/politicalAreaCard";
import { GeographicalAreaCard } from "@/lib/components/politics/geographicalAreaCard";
import { KeyIssueCard } from "@/lib/components/politics/keyIssueCard";
import {
  GeographicalArea,
  PoliticalArea,
  PoliticalIssue,
} from "~/sanity.types";
import { politikPageQuery } from "@/lib/queries/politik";
import { listingPageByKeyQuery } from "@/lib/queries/pages";
import { sanityClient } from "@/lib/sanity/client";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import { generateMetadata as buildMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { ROUTE_BASE } from "@/lib/routes";
import { ListingHeader } from "@/lib/components/shared/ListingHeader";

type ListingPage = {
  title?: string;
  intro?: string;
  seo?: {
    title?: string;
    description?: string;
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const listing = await sanityClient.fetch<ListingPage>(
    listingPageByKeyQuery,
    { key: "politics" }
  );

  const title =
    listing?.seo?.title ||
    listing?.title ||
    "Vår politik | Nackamoderaterna";
  const description =
    listing?.seo?.description ||
    "Läs mer om vår politik och våra ståndpunkter i olika frågor";

  return buildMetadata({
    title,
    description,
    url: ROUTE_BASE.POLITICS,
  });
}

export const revalidate = 300;

export type PoliticalIssueWithAreas = Omit<
  PoliticalIssue,
  "politicalAreas" | "geographicalAreas"
> & {
  fulfilled?: boolean;
  politicalAreas: Array<{
    _id: string;
    name: string;
    slug: {
      current: string;
    };
  }>;

  geographicalAreas?: Array<{
    _id: string;
    name: string;
    image: any;
    slug: {
      current: string;
    };
  }>;
};

export type PoliticalIssuesPageData = {
  featuredPoliticalIssues: PoliticalIssueWithAreas[];
  fulfilledPoliticalIssues: PoliticalIssueWithAreas[];
  politicalAreas: Array<
    Omit<PoliticalArea, "icon"> & {
      icon?: {
        name?: string;
      };
    }
  >;
  geographicalAreas: GeographicalArea[];
};

export default async function PoliticsPage() {
  const [data, listing] = await Promise.all([
    sanityClient.fetch<PoliticalIssuesPageData>(
      politikPageQuery,
      {},
      {
        next: { revalidate: 300 },
      }
    ),
    sanityClient.fetch<ListingPage>(
      listingPageByKeyQuery,
      { key: "politics" },
      {
        next: { revalidate: 300 },
      }
    ),
  ]);
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <ListingHeader
          title={listing?.title}
          intro={listing?.intro}
          fallbackTitle="Vår politik"
        />

          {/* Key Issues Section */}
          <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-foreground">
            Våra kärnfrågor
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.featuredPoliticalIssues.map((issue) => (
              <KeyIssueCard
                title={issue.question || ""}
                key={issue._id}
                relatedArea={issue.politicalAreas[0].name}
                slug={issue.politicalAreas[0].slug.current}
              />
            ))}
          </div>
        </section>

        {/* Political Areas Grid */}
        <section className="mb-16">
        <h2 className="mb-6 text-3xl font-bold text-foreground">
            Politik per politikområde
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.politicalAreas.map((area) => {
              const Icon = getLucideIcon(area.icon?.name);
              return (
                <PoliticalAreaCard
                  key={area._id}
                  title={area.name || ""}
                  href={`${ROUTE_BASE.POLITICS}/${area.slug?.current}`}
                  icon={Icon || undefined}
                />
              );
            })}
          </div>
        </section>

        {/* Geographical Areas Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-foreground">
            Politik per område
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.geographicalAreas.map((area) => (
              <GeographicalAreaCard
                key={area._id}
                title={area.name || ""}
                image={area.image}
                slug={area.slug?.current || ""}
              />
            ))}
          </div>
        </section>

      

        {/* Fulfilled Promises Section */}
        {data.fulfilledPoliticalIssues.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 text-3xl font-bold text-foreground">
              Uppfyllda vallöften
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.fulfilledPoliticalIssues.map((issue) => (
                <KeyIssueCard
                  key={issue._id}
                  title={issue.question || ""}
                  relatedArea={issue.politicalAreas?.[0]?.name || ""}
                  slug={issue.politicalAreas?.[0]?.slug?.current || ""}
                  fulfilled
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
