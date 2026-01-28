import Link from "next/link";
import { PeopleCard } from "./PeopleCard";
import { PoliticianWithNamnd } from "@/lib/politicians";
import { ROUTE_BASE } from "@/lib/routes";

interface PoliticianSectionProps {
  title: string;
  politicians: PoliticianWithNamnd[];
  cardType: "large" | "small";
  /** Shared title for all in section (e.g. for namnd groups) */
  positionTitle?: string;
  /** Per-politician title (overrides positionTitle when set) */
  getTitle?: (p: PoliticianWithNamnd) => string;
}

export function PoliticianSection({
  title,
  politicians,
  cardType,
  positionTitle,
  getTitle,
}: PoliticianSectionProps) {
  if (politicians.length === 0) {
    return null;
  }

  const resolveTitle = (p: PoliticianWithNamnd) =>
    getTitle ? getTitle(p) : positionTitle;

  return (
    <section className="mb-10">
      {title && (
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {politicians.map((politician) => {
          const roleTitle = resolveTitle(politician);
          if (cardType === "large") {
            return (
              <PeopleCard
                key={politician._id}
                slug={politician.slug?.current || ""}
                image={politician.image}
                name={politician.name}
                title={roleTitle}
                size="large"
              />
            );
          }
          return (
          
              <PeopleCard
                key={politician._id}
                slug={politician.slug?.current || ""}
                name={politician.name}
                title={roleTitle}
                size="small"
                image={politician.image}
              />
          );
        })}
      </div>
    </section>
  );
}
