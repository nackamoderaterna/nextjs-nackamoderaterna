import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { cleanPoliticianData, PoliticianWithNamnd } from "@/lib/politicians";
import { portableTextComponents } from "@/lib/components/shared/PortableTextComponents";
import { ContentHero } from "@/lib/components/shared/ContentHero";
import { ContentCard } from "@/lib/components/politics/contentCard";
import { PoliticianSidebar } from "@/lib/components/politician/PoliticianSidebar";
import { ContentWithSidebar } from "@/lib/components/shared/ContentWithSidebar";
import { PageContainer } from "@/lib/components/shared/PageContainer";
import { Section } from "@/lib/components/shared/Section";
import { SetBreadcrumbTitle } from "@/lib/components/shared/BreadcrumbTitleContext";
import { mapPoliticianRoles } from "@/lib/utils/mapPoliticianRoles";
import { ArrowRight } from "lucide-react";
import { ExpandableNewsList } from "@/lib/components/news/ExpandableNewsList";
import { PressGallery } from "@/lib/components/politician/PressGallery";
import { politicianBySlugQuery, allPoliticianSlugsQuery } from "@/lib/queries/politicians";
import { generateMetadata as generateSEOMetadata, getDefaultOgImage } from "@/lib/utils/seo";
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
  const [politicianRaw, fallbackImage] = await Promise.all([
    sanityClient.fetch<PoliticianWithNamnd>(politicianBySlugQuery, { slug }),
    getDefaultOgImage(),
  ]);

  if (!politicianRaw) {
    return generateSEOMetadata({
      title: "Politiker hittades inte",
      description: "Den begärda politikern kunde inte hittas",
    });
  }
  
  const politician = cleanPoliticianData(politicianRaw);

  const imageUrl = politician.image
    ? buildImageUrl(politician.image, { width: 1200, height: 630 })
    : fallbackImage;

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
  const roles = mapPoliticianRoles({ politician });

  const hasSidebar =
    politician.email ||
    politician.phone ||
    politician.socialLinks ||
    (politician.politicalAreas?.length ?? 0) > 0;

  const tocEntries: { id: string; label: string }[] = [];
  if (politician.bio) tocEntries.push({ id: "biografi", label: "Biografi" });
  if (roles.length > 0) tocEntries.push({ id: "uppdrag", label: "Uppdrag" });
  if (politician.referencedInNews?.length)
    tocEntries.push({ id: "nyheter", label: "Artiklar" });
  if (politician.pressbilder?.length)
    tocEntries.push({ id: "pressbilder", label: "Pressbilder" });

  return (
    <PageContainer as="main" paddingY="compact">
      <SetBreadcrumbTitle title={politician.name ?? ""} />
      <ContentHero
        pageType="Politiker"
        image={politician.image}
        title={politician.name ?? ""}
        subtitle={
          politician.livingArea?.name
            ? `${politician.livingArea.name}`
            : undefined
        }
        subtitleHref={
          politician.livingArea?.slug?.current
            ? `${ROUTE_BASE.AREAS}/${politician.livingArea.slug.current}`
            : undefined
        }
      />
      <div className="mt-8 pb-8 border-b border-border">
        <ContentWithSidebar
          mainContent={
            <div className="space-y-8">
              {tocEntries.length > 1 && (
                <nav aria-label="Innehåll" className="text-sm">
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    Innehåll
                  </h2>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                    {tocEntries.map(({ id, label }) => (
                      <li key={id}>
                        <a
                          href={`#${id}`}
                          className="hover:text-primary transition-colors underline"
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
              {politician.bio && (
                <div id="biografi" className="prose md:prose-lg scroll-mt-24">
                  <PortableText value={politician.bio} components={portableTextComponents} />
                </div>
              )}
              {roles.length > 0 && (
                <section id="uppdrag" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Uppdrag
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roles.map((role, index) => (
                      <ContentCard
                        key={index}
                        title={role.title}
                        description={role.description}
                        href={role.href}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          }
          sidebarContent={
            hasSidebar ? (
              <PoliticianSidebar
                email={politician.email}
                phone={politician.phone}
                socialLinks={politician.socialLinks}
                politicalAreas={politician.politicalAreas}
              />
            ) : null
          }
        />
      </div>

      {politician.referencedInNews &&
        politician.referencedInNews.length > 0 && (
          <Section
            id="nyheter"
            className="mt-8 scroll-mt-24"
            title="Artiklar"
            actions={
              <Link
                href={ROUTE_BASE.NEWS}
                className="text-sm font-medium flex items-center gap-1"
              >
                Alla nyheter
                <ArrowRight className="w-4 h-4" />
              </Link>
            }
          >
            <ExpandableNewsList
              items={politician.referencedInNews}
              initialVisible={3}
            />
          </Section>
        )}

      {politician.pressbilder && politician.pressbilder.length > 0 && (
        <Section
          id="pressbilder"
          className="mt-8 scroll-mt-24"
          title="Pressbilder"
        >
          <PressGallery images={politician.pressbilder} />
        </Section>
      )}
    </PageContainer>
  );
}
