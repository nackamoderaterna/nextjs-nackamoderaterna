import Link from "next/link";
import {
  groupPoliticiansByRole,
  politiciansDirectoryQuery,
  PoliticianWithNamnd,
  positionTitles,
  sectionTitles,
} from "@/lib/politicians";
import { sanityClient } from "@/lib/sanity/client";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { PeopleCard } from "@/lib/components/politician/PoliticianCardLarge";
import { PoliticianCardSmall } from "@/lib/components/politician/PoliticianCardSmall";

export default async function PoliticiansPage() {
  const politicians = await sanityClient.fetch<PoliticianWithNamnd[]>(
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
                <PeopleCard
                  key={p._id}
                  image={p.image}
                  name={p.name}
                  title={positionTitles.ordforande}
                  size="large"
                />
              ))}
              {grouped.kommunalrad.ordinary.map((p) => (
                <PeopleCard
                  key={p._id}
                  image={p.image}
                  name={p.name}
                  title={positionTitles.ordforande}
                  size="large"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {grouped.partyBoard.ordforande.map((p) => (
                <PeopleCard
                  key={p._id}
                  image={p.image}
                  name={p.name}
                  title={positionTitles.ordforande}
                  size="small"
                />
              ))}
              {grouped.partyBoard.ledamot.map((p) => (
                <PeopleCard
                  key={p._id}
                  image={p.image}
                  name={p.name}
                  title={positionTitles.ordforande}
                  size="small"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {grouped.kommunfullmaktige.ordinary.map((p) => (
                <PoliticianCardSmall
                  key={p._id}
                  name={p.name}
                  image={p.image}
                  subtitle={positionTitles.ledamot}
                />
              ))}
              {grouped.kommunfullmaktige.substitute.map((p) => (
                <PoliticianCardSmall
                  key={p._id}
                  name={p.name}
                  image={p.image}
                  subtitle={positionTitles.substitute}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
