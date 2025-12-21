import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { Politician } from "~/sanity.types";
import { sanityClient } from "@/lib/sanity/client";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { PoliticianWithReferences } from "@/lib/politicians";

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
  socialMedia
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
  const politician = await sanityClient.fetch<PoliticianWithReferences>(
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
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
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
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
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
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
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
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
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
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
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
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
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
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                        </svg>
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
    </div>
  );
}
