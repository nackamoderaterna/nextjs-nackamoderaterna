import { PoliticalAreaCard } from "@/lib/components/politics/politicalAreaCard";
import { GeographicalAreaCard } from "@/lib/components/politics/geographicalAreaCard";
import { KeyIssueCard } from "@/lib/components/politics/keyIssueCard";
import {
  GeographicalArea,
  PoliticalArea,
  PoliticalIssue,
} from "~/sanity.types";
import { politikPageQuery } from "@/lib/queries/politik";
import { sanityClient, REVALIDATE_TIME } from "@/lib/sanity/client";
import { lucideIconMap } from "@/lib/utils/iconUtils";
import { generateMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Vår politik | Nackamoderaterna",
  description: "Läs mer om vår politik och våra ståndpunkter i olika frågor",
  url: "/politik",
});

export const revalidate = 300;

export type PoliticalIssueWithAreas = Omit<
  PoliticalIssue,
  "politicalAreas" | "geographicalAreas"
> & {
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
  politicalAreas: PoliticalArea[];
  geographicalAreas: GeographicalArea[];
};

export default async function PoliticsPage() {
  const data = await sanityClient.fetch<PoliticalIssuesPageData>(
    politikPageQuery,
    {},
    {
      next: { revalidate: REVALIDATE_TIME },
    }
  );
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            Vår politik
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur. Luctus consequat dis
            scelerisque convallis ut pretium urna. Gravida curabitur pretium sed
            consequat eros sit pulvinar eget. Ultricies orci fringilla donec
            velit massa. Pellentesque integer erat laoreet nulla. iaculis congue
            massa mi dictum. Quam habitant faucis dui donec orci pharetra est.
          </p>
        </div>

        {/* Political Areas Grid */}
        <section className="mb-16">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.politicalAreas.map((area) => (
              <PoliticalAreaCard
                key={area._id}
                title={area.name || ""}
                href={`/politik/${area.slug?.current}`}
                icon={lucideIconMap["Heart"]}
              />
            ))}
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
      </main>
    </div>
  );
}
