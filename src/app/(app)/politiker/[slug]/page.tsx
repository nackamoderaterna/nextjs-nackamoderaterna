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
    publishedAt,
    excerpt,
    mainImage
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/politiker"
          className="text-sm text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Tillbaka till alla politiker
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="md:flex">
            <div className="md:w-1/3">
              {politician.image ? (
                <SanityImage
                  image={politician.image}
                  alt={politician.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-24 h-24 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="md:w-2/3 p-6 md:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {politician.name}
              </h1>

              {politician.livingArea && (
                <p className="text-gray-600 mb-4">
                  Bor i {politician.livingArea.name}
                </p>
              )}

              {/* Contact Information */}
              {(politician.email || politician.phone) && (
                <div className="mb-6 space-y-2">
                  {politician.email && (
                    <div className="flex items-center text-gray-700">
                      <IconMail />
                      <a
                        href={`mailto:${politician.email}`}
                        className="hover:text-blue-600"
                      >
                        {politician.email}
                      </a>
                    </div>
                  )}
                  {politician.phone && (
                    <div className="flex items-center text-gray-700">
                      <IconPhone />
                      <a
                        href={`tel:${politician.phone}`}
                        className="hover:text-blue-600"
                      >
                        {politician.phone}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Social Media */}
              {politician.socialMedia &&
                Object.values(politician.socialMedia).some((v) => v) && (
                  <div className="flex gap-3 mb-6">
                    {politician.socialMedia.facebook && (
                      <a
                        href={politician.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <span className="sr-only">Facebook</span>
                        <IconBrandFacebook />
                      </a>
                    )}
                    {politician.socialMedia.twitter && (
                      <a
                        href={politician.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-400"
                      >
                        <span className="sr-only">Twitter</span>
                        <IconBrandTwitter />
                      </a>
                    )}
                    {politician.socialMedia.instagram && (
                      <a
                        href={politician.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-pink-600"
                      >
                        <span className="sr-only">Instagram</span>
                        <IconBrandInstagram />
                      </a>
                    )}
                    {politician.socialMedia.linkedin && (
                      <a
                        href={politician.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-700"
                      >
                        <span className="sr-only">LinkedIn</span>
                        <IconBrandLinkedin />
                      </a>
                    )}
                    {politician.socialMedia.tiktok && (
                      <a
                        href={politician.socialMedia.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-black"
                      >
                        <span className="sr-only">TikTok</span>
                        <IconBrandTiktok />
                      </a>
                    )}
                  </div>
                )}
            </div>
          </div>

          {/* Positions Section */}
          <div className="border-t border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Uppdrag
            </h2>

            <div className="space-y-4">
              {politician.kommunalrad?.active && (
                <div>
                  <h3 className="font-medium text-gray-900">Kommunalråd</h3>
                  <p className="text-gray-600">
                    {politician.kommunalrad.role === "president"
                      ? "Kommunstyrelsens ordförande"
                      : "Kommunalråd"}
                  </p>
                </div>
              )}

              {politician.partyBoard?.active && (
                <div>
                  <h3 className="font-medium text-gray-900">Styrelseuppdrag</h3>
                  <p className="text-gray-600">
                    {
                      positionTitles[
                        politician.partyBoard
                          .position as keyof typeof positionTitles
                      ]
                    }
                  </p>
                </div>
              )}

              {politician.kommunfullmaktige?.active && (
                <div>
                  <h3 className="font-medium text-gray-900">
                    Kommunfullmäktige
                  </h3>
                  <p className="text-gray-600">
                    {
                      positionTitles[
                        politician.kommunfullmaktige
                          .role as keyof typeof positionTitles
                      ]
                    }
                  </p>
                </div>
              )}

              {politician.namndPositions &&
                politician.namndPositions.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Nämnder</h3>
                    <ul className="space-y-2">
                      {politician.namndPositions.map((pos, idx) => (
                        <li key={idx} className="text-gray-600">
                          <Link
                            href={`/namnder/${pos.namnd?.slug?.current}`}
                            className="hover:text-blue-600"
                          >
                            {pos.namnd.title}
                          </Link>
                          {" - "}
                          {positionTitles[
                            pos.position as keyof typeof positionTitles
                          ] || pos.position}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>

          {/* Political Areas */}
          {politician.politicalAreas &&
            politician.politicalAreas.length > 0 && (
              <div className="border-t border-gray-200 p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Hjärtefrågor
                </h2>
                <div className="flex flex-wrap gap-2">
                  {politician.politicalAreas.map((area) => (
                    <span
                      key={area._id}
                      className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {area.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Biography */}
          {politician.bio && politician.bio.length > 0 && (
            <div className="border-t border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Biografi
              </h2>
              <div className="prose prose-gray max-w-none">
                <PortableText value={politician.bio} />
              </div>
            </div>
          )}
        </div>
      </div>
      <h2>Nyheter</h2>
      {politician.referencedInNews?.map((news) => <p>{news.title}</p>)}
    </div>
  );
}
