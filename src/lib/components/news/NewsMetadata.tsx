import Link from "next/link";
import { SanityImage } from "../shared/SanityImage";
import { NewsWithReferences } from "@/types/news";
import { ROUTE_BASE } from "@/lib/routes";

export function NewsMetadata({ news }: { news: NewsWithReferences }) {
  const hasMetadata =
    (news.referencedPoliticians && news.referencedPoliticians.length > 0) ||
    (news.politicalAreas && news.politicalAreas.length > 0) ||
    (news.geographicalAreas && news.geographicalAreas.length > 0);

  if (!hasMetadata) return null;

  return (
    <div className="border-t border-gray-200 p-6 md:p-8 bg-gray-50">
      <div className="space-y-6">
        {news.referencedPoliticians &&
          news.referencedPoliticians.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Omnämnda politiker
              </h3>
              <div className="flex flex-wrap gap-3">
                {news.referencedPoliticians.map((politician) => (
                  <Link
                    key={politician._id}
                    href={`${ROUTE_BASE.POLITICIANS}/${politician.slug?.current}`}
                    className="flex items-center gap-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-2"
                  >
                    {politician.image && (
                      <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <SanityImage
                          image={politician.image}
                          alt={politician.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {politician.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        {news.politicalAreas && news.politicalAreas.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Politiska områden
            </h3>
            <div className="flex flex-wrap gap-2">
              {news.politicalAreas.map((area) => (
                <span
                  key={area._id}
                  className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {area.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {news.geographicalAreas && news.geographicalAreas.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Geografiska områden
            </h3>
            <div className="flex flex-wrap gap-2">
              {news.geographicalAreas.map((area) => (
                <span
                  key={area._id}
                  className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {area.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
