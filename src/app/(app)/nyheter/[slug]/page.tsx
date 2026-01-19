import { groq, PortableText } from "next-sanity";
import { notFound } from "next/navigation";
import Link from "next/link";
import { News } from "~/sanity.types";
import { sanityClient } from "@/lib/sanity/client";
import { NewsHeader } from "@/lib/components/news/NewsHeader";
import { NewsBody } from "@/lib/components/news/NewsBody";
import { NewsMetadata } from "@/lib/components/news/NewsMetadata";
import { NewsRelated } from "@/lib/components/news/NewsRelated";
import { NewsWithReferences } from "@/types/news";
import { newsQuery } from "@/lib/queries/nyheter";
import { ContentWithSidebar } from "@/lib/components/shared/ContentWithSidebar";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { formatDate } from "@/lib/utils/dateUtils";
import { PeopleCard } from "@/lib/components/politician/PoliticianCardLarge";

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const news = await sanityClient.fetch<NewsWithReferences>(newsQuery, {
    slug,
  });

  if (!news) {
    notFound();
  }

  const mainContent = (
    <div>
      {news.politicalAreas && news.politicalAreas.length > 0 && (
        <div className="mb-4">
          <span className="inline-block text-sm font-medium text-blue-600">
            {news.politicalAreas[0].name}
          </span>
        </div>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
        {news.title}
      </h1>
      <time className="text-sm text-muted-foreground">
        {formatDate(news.effectiveDate)}
      </time>

      <h2 className="text-xl font-medium text-foreground mt-8">
        {news.excerpt}
      </h2>
      {news.body && (
        <div className="prose md:prose-lg mt-8">
          <PortableText value={news.body} />
        </div>
      )}
    </div>
  );

  const sidebar = (
    <div className="grid gap-4">
      <div className="aspect-[4/5]">
        <SanityImage image={news.mainImage} />
      </div>
      <div className="mb-8">
        {news.referencedPoliticians && (
          <div className="space-y-4 rounded bg-muted grid p-4">
            <h2 className="text-muted-foreground mb-4">Omnämnda Företrädare</h2>
            {news.referencedPoliticians.map((politiker) => (
              <PeopleCard
                image={politiker.image}
                name={politiker.name}
                slug={politiker.slug?.current || ""}
                size={"small"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <ContentWithSidebar mainContent={mainContent} sidebarContent={sidebar} />
    </div>
  );
}

// <div className="min-h-screen bg-gray-50">
//   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//     <Link
//       href="/nyheter"
//       className="text-sm text-blue-600 hover:text-blue-800 mb-6 inline-block"
//     >
//       ← Tillbaka till nyheter
//     </Link>

//     <article className="bg-white rounded-lg shadow-lg overflow-hidden">
//       <NewsHeader news={news} />
//       <NewsBody news={news} />
//       <NewsMetadata news={news} />
//     </article>

//     <NewsRelated news={news} />
//   </div>
// </div>
