import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { Politician } from "~/sanity.types";
import { sanityClient } from "@/lib/sanity/client";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { PoliticianWithNamnd } from "@/lib/politicians";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconBrandTwitter,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import { PoliticianHero } from "@/lib/components/politician/PoliticianHero";
import { RoleSidebar } from "@/lib/components/politician/roleSidebar";
import { mapPoliticianRoles } from "@/lib/utils/mapPoliticianRoles";
import { ArrowRight } from "lucide-react";
import { NewsCard } from "@/lib/components/news/NewsCard";

const politicianQuery = groq`*[_type == "politician" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  image,
  email,
  phone,
  bio,
  kommunalrad,
  partyBoard,
  kommunfullmaktige,
  "namndPositions": namndPositions[] {
    position,
    "namnd": namndRef-> {
      _id,
      title,
      slug
    }
  },
  "livingArea": livingArea-> {
    _id,
    name,
    slug,
  },
  "politicalAreas": politicalAreas[]-> {
    _id,
    name,
    
  },
  socialMedia,
  "referencedInNews": *[_type == "news" && references(^._id)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    _createdAt,
    dateOverride,
    excerpt,
  }
  }`;

const positionTitles = {
  president: "Ordförande",
  "first-president": "1:e vice ordförande",
  "second-president": "2:e vice ordförande",
  groupleader: "Gruppledare",
  member: "Ledamot",
  replacement: "Ersättare",
  ordinary: "Kommunalråd",
  ordforande: "Ordförande",
  ledamot: "Ledamot",
  substitute: "Ersättare",
} as const;

export default async function PoliticianPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const politician = await sanityClient.fetch<PoliticianWithNamnd>(
    politicianQuery,
    {
      slug,
    },
  );

  if (!politician) {
    notFound();
  }

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
            <PortableText value={politician.bio} />
          </div>
        )}
        <div>
          <RoleSidebar
            heading={"Uppdrag"}
            roles={mapPoliticianRoles({ politician })}
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
                href="/nyheter"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Se alla nyheter
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid">
              {politician.referencedInNews?.map((news) => (
                <NewsCard
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

//   {/* Political Areas */}
//   {politician.politicalAreas &&
//     politician.politicalAreas.length > 0 && (
//       <div className="border-t border-gray-200 p-6 md:p-8">
//         <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//           Hjärtefrågor
//         </h2>
//         <div className="flex flex-wrap gap-2">
//           {politician.politicalAreas.map((area) => (
//             <span
//               key={area._id}
//               className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
//             >
//               {area.name}
//             </span>
//           ))}
//         </div>
//       </div>
//     )}

//   {/* Biography */}
//   {politician.bio && politician.bio.length > 0 && (
//     <div className="border-t border-gray-200 p-6 md:p-8">
//       <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//         Biografi
//       </h2>
//       <div className="prose prose-gray max-w-none">
//         <PortableText value={politician.bio} />
//       </div>
//     </div>
//   )}
// </div>
