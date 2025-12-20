import {
  politiciansDirectoryQuery,
  groupPoliticiansByRole,
  positionTitles,
  sectionTitles,
  type PoliticianWithReferences,
} from "@/lib/politicians";
import Image from "next/image";
import Link from "next/link";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { sanityClient } from "@/lib/sanity/client";

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
            {grouped.kommunalrad.president.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  {positionTitles.president}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {grouped.kommunalrad.president.map((p) => (
                    <PoliticianCard key={p._id} politician={p} />
                  ))}
                </div>
              </div>
            )}
            {grouped.kommunalrad.ordinary.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  {positionTitles.ordinary}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {grouped.kommunalrad.ordinary.map((p) => (
                    <PoliticianCard key={p._id} politician={p} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Party Board */}
        {(grouped.partyBoard.ordforande.length > 0 ||
          grouped.partyBoard.ledamot.length > 0) && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {sectionTitles.partyBoard}
            </h2>
            {grouped.partyBoard.ordforande.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  {positionTitles.ordforande}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {grouped.partyBoard.ordforande.map((p) => (
                    <PoliticianCard key={p._id} politician={p} />
                  ))}
                </div>
              </div>
            )}
            {grouped.partyBoard.ledamot.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  {positionTitles.ledamot}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {grouped.partyBoard.ledamot.map((p) => (
                    <PoliticianCard key={p._id} politician={p} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Kommunfullmäktige */}
        {(grouped.kommunfullmaktige.ordinary.length > 0 ||
          grouped.kommunfullmaktige.substitute.length > 0) && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {sectionTitles.kommunfullmaktige}
            </h2>
            {grouped.kommunfullmaktige.ordinary.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  {positionTitles.ordinary}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {grouped.kommunfullmaktige.ordinary.map((p) => (
                    <PoliticianCard key={p._id} politician={p} />
                  ))}
                </div>
              </div>
            )}
            {grouped.kommunfullmaktige.substitute.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  {positionTitles.substitute}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {grouped.kommunfullmaktige.substitute.map((p) => (
                    <PoliticianCard key={p._id} politician={p} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Nämnder */}
        {Object.keys(grouped.namnder).length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {sectionTitles.namnder}
            </h2>
            {Object.entries(grouped.namnder).map(([id, data]) => (
              <div key={id} className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {data.namndInfo.title}
                </h3>
                {Object.entries(data.positions).map(([pos, pols]) => (
                  <div key={pos} className="mb-6">
                    <h4 className="text-base font-medium text-gray-700 mb-3">
                      {positionTitles[pos as keyof typeof positionTitles] ||
                        pos}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {pols.map((p) => (
                        <PoliticianCard key={p._id} politician={p} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </section>
        )}

        {/* Other */}
        {grouped.other.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {sectionTitles.other}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {grouped.other.map((p) => (
                <PoliticianCard key={p._id} politician={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function PoliticianCard({
  politician,
}: {
  politician: PoliticianWithReferences;
}) {
  return (
    <Link
      href={`/politiker/${politician.slug?.current}`}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="aspect-square relative bg-gray-200">
        {politician.image ? (
          <SanityImage image={politician.image} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900">
          {politician.name}
        </h3>
        {politician.livingArea && (
          <p className="text-xs text-gray-600 mt-1">
            {politician.livingArea.title}
          </p>
        )}
      </div>
    </Link>
  );
}

// function PoliticianCard({
//   politician,
// }: {
//   politician: PoliticianWithReferences;
// }) {
//   return (
//     <Link
//       href={`/politiker/${politician.slug?.current}`}
//       className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
//     >
//       <div className="aspect-square relative bg-gray-200">
//         {politician.image ? (
//           <SanityImage image={politician.image} />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-gray-400">
//             <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//             </svg>
//           </div>
//         )}
//       </div>

//       <div className="p-4">
//         <h3 className="text-lg font-semibold text-gray-900 mb-1">
//           {politician.name}
//         </h3>

//         {politician.livingArea && (
//           <p className="text-sm text-gray-600 mb-2">
//             {politician.livingArea.title}
//           </p>
//         )}

//         {(politician.email || politician.phone) && (
//           <div className="mt-3 space-y-1">
//             {politician.email && (
//               <p className="text-sm text-gray-600 truncate">
//                 {politician.email}
//               </p>
//             )}
//             {politician.phone && (
//               <p className="text-sm text-gray-600">{politician.phone}</p>
//             )}
//           </div>
//         )}

//         {politician.politicalAreas && politician.politicalAreas.length > 0 && (
//           <div className="mt-3 flex flex-wrap gap-2">
//             {politician.politicalAreas.slice(0, 3).map((area) => (
//               <span
//                 key={area._id}
//                 className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
//               >
//                 {area.title}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>
//     </Link>
//   );
// }
