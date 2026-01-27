import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { cleanPoliticianData, PoliticianWithNamnd } from "@/lib/politicians";
import { portableTextComponents } from "@/lib/components/shared/PortableTextComponents";
import { PoliticianHero } from "@/lib/components/politician/PoliticianHero";
import { RoleSidebar } from "@/lib/components/politician/roleSidebar";
import { PoliticalAreasSidebar } from "@/lib/components/politician/PoliticalAreasSidebar";
import { mapPoliticianRoles } from "@/lib/utils/mapPoliticianRoles";
import { ArrowRight } from "lucide-react";
import { NewsCard } from "@/lib/components/news/NewsCard";
import { politicianBySlugQuery, allPoliticianSlugsQuery } from "@/lib/queries/politicians";
import { generateMetadata as generateSEOMetadata } from "@/lib/utils/seo";
import { Metadata } from "next";
import { buildImageUrl } from "@/lib/sanity/image";
import { ROUTE_BASE } from "@/lib/routes";

// Generate static params for all politicians at build time
export async function generateStaticParams() {
  const politicians = await sanityClient.fetch<{ slug: string }[]>(
    allPoliticianSlugsQuery
  );
  
  return politicians.map((politician) => ({
    slug: politician.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const politicianRaw = await sanityClient.fetch<PoliticianWithNamnd>(
    politicianBySlugQuery,
    { slug }
  );

  if (!politicianRaw) {
    return generateSEOMetadata({
      title: "Politiker hittades inte",
      description: "Den begärda politikern kunde inte hittas",
    });
  }
  
  const politician = cleanPoliticianData(politicianRaw);

  const imageUrl = politician.image
    ? buildImageUrl(politician.image, { width: 1200, height: 630 })
    : undefined;

  return generateSEOMetadata({
    title: `${politician.name} | Nackamoderaterna`,
    description: politician.bio
      ? `${politician.name} - ${politician.bio[0]?.children?.[0]?.text?.substring(0, 150)}...`
      : `Läs mer om ${politician.name}`,
    image: imageUrl,
    url: `${ROUTE_BASE.POLITICIANS}/${slug}`,
  });
}

export const revalidate = 300;

export default async function PoliticianPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const politicianRaw = await sanityClient.fetch<PoliticianWithNamnd>(
    politicianBySlugQuery,
    { slug },
    {
      next: { revalidate: 300 },
    }
  );

  if (!politicianRaw) {
    notFound();
  }
  
  // Clean all invisible Unicode characters from politician data
  const politician = cleanPoliticianData(politicianRaw);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PoliticianHero
        name={politician.name || ""}
        location={politician.livingArea?.name || ""}
        email={politician.email}
        phone={politician.phone}
        image={politician.image}
        socialLinks={{
          facebook: politician.socialMedia?.facebook,
          tiktok: politician.socialMedia?.tiktok,
          instagram: politician.socialMedia?.instagram,
        }}
      />
      {/* Content Grid */}
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        {/* Main Content */}
        {politician.bio && (
          <div className="md:col-span-2 prose md:prose-lg">
            <PortableText value={politician.bio} components={portableTextComponents} />
          </div>
        )}
        <div className="space-y-6">
          <RoleSidebar
            heading={"Uppdrag"}
            roles={mapPoliticianRoles({ politician })}
          />
          <PoliticalAreasSidebar
            politicalAreas={politician.politicalAreas}
          />
        </div>
      </div>

      {politician.referencedInNews &&
        politician.referencedInNews.length > 0 && (
          <>
            <div className="mt-8 flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Artiklar som omnämner {politician.name}
              </h2>
              <Link
                href={ROUTE_BASE.NEWS}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Se alla nyheter
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid">
              {politician.referencedInNews?.map((news) => (
                <NewsCard
                  key={news._id}
                  date={news.dateOverride ? news.dateOverride : news._createdAt}
                  slug={news.slug.current}
                  title={news.title}
                  isLast={false}
                  excerpt={news.excerpt || ""}
                />
              ))}
            </div>
          </>
        )}
    </main>
  );
}
