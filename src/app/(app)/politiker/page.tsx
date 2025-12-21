import Link from "next/link";
import {
  groupPoliticiansByRole,
  politiciansDirectoryQuery,
  PoliticianWithReferences,
  positionTitles,
  sectionTitles,
} from "@/lib/politicians";
import { sanityClient } from "@/lib/sanity/client";
import { SanityImage } from "@/lib/components/shared/SanityImage";

export default async function PoliticiansPage() {
  const politicians = await sanityClient.fetch<PoliticianWithReferences[]>(
    politiciansDirectoryQuery,
  );
  const grouped = groupPoliticiansByRole(politicians);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Våra politiker
        </h1>

        {/* Kommunalråd */}
        {(grouped.kommunalrad.president.length > 0 ||
          grouped.kommunalrad.ordinary.length > 0) && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {sectionTitles.kommunalrad}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {grouped.kommunalrad.president.map((p) => (
                <LargePoliticianCard
                  key={p._id}
                  politician={p}
                  role={positionTitles.ordforande}
                />
              ))}
              {grouped.kommunalrad.ordinary.map((p) => (
                <LargePoliticianCard
                  key={p._id}
                  politician={p}
                  role={positionTitles.ordinary}
                />
              ))}
            </div>
          </section>
        )}

        {/* Party Board */}
        {(grouped.partyBoard.ordforande.length > 0 ||
          grouped.partyBoard.ledamot.length > 0) && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {sectionTitles.partyBoard}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grouped.partyBoard.ordforande.map((p) => (
                <CompactPoliticianCard
                  key={p._id}
                  politician={p}
                  role={positionTitles.ordforande}
                />
              ))}
              {grouped.partyBoard.ledamot.map((p) => (
                <CompactPoliticianCard
                  key={p._id}
                  politician={p}
                  role={positionTitles.ledamot}
                />
              ))}
            </div>
          </section>
        )}

        {/* Kommunfullmäktige */}
        {(grouped.kommunfullmaktige.ordinary.length > 0 ||
          grouped.kommunfullmaktige.substitute.length > 0) && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {sectionTitles.kommunfullmaktige}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grouped.kommunfullmaktige.substitute.map((p) => (
                <CompactPoliticianCard
                  key={p._id}
                  politician={p}
                  role={positionTitles.substitute}
                />
              ))}
              {grouped.kommunfullmaktige.ordinary.map((p) => (
                <CompactPoliticianCard
                  key={p._id}
                  politician={p}
                  role={positionTitles.ordinary}
                />
              ))}
            </div>
          </section>
        )}

        {/* Nämnder */}
        {Object.keys(grouped.namnder).length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {sectionTitles.namnder}
            </h2>
            {Object.entries(grouped.namnder).map(([id, data]) => {
              const positionOrder = [
                "president",
                "first-president",
                "second-president",
                "groupleader",
                "member",
                "replacement",
              ];
              const sortedPositions = Object.entries(data.positions).sort(
                ([a], [b]) =>
                  positionOrder.indexOf(a) - positionOrder.indexOf(b),
              );

              return (
                <div key={id} className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {data.namndInfo.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedPositions.flatMap(([pos, pols]) =>
                      pols.map((p) => (
                        <CompactPoliticianCard
                          key={p._id}
                          politician={p}
                          role={
                            positionTitles[
                              pos as keyof typeof positionTitles
                            ] || pos
                          }
                        />
                      )),
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Other */}
        {grouped.other.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {sectionTitles.other}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grouped.other.map((p) => (
                <CompactPoliticianCard key={p._id} politician={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function LargePoliticianCard({
  politician,
  role,
}: {
  politician: PoliticianWithReferences;
  role: string;
}) {
  return (
    <Link
      href={`/politiker/${politician.slug?.current}`}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="aspect-square relative bg-gray-200">
        {politician.image ? (
          <SanityImage image={politician.image} height={500} width={500} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-600 mb-1">{role}</p>
        <h3 className="text-base font-semibold text-gray-900">
          {politician.name}
        </h3>
        {politician.livingArea && (
          <p className="text-sm text-gray-600 mt-1">
            {politician.livingArea.name}
          </p>
        )}
      </div>
    </Link>
  );
}

function CompactPoliticianCard({
  politician,
  role,
}: {
  politician: PoliticianWithReferences;
  role?: string;
}) {
  return (
    <Link
      href={`/politiker/${politician.slug?.current}`}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center p-3 gap-3"
    >
      <div className="w-16 h-16 flex-shrink-0 relative bg-gray-200 rounded-lg overflow-hidden">
        {politician.image ? (
          <SanityImage image={politician.image} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {politician.name}
        </h3>
        {role && <p className="text-xs text-gray-600 mt-0.5">{role}</p>}
        {politician.livingArea && (
          <p className="text-xs text-gray-500 mt-0.5">
            {politician.livingArea.name}
          </p>
        )}
      </div>
    </Link>
  );
}
