import { ResponsiveGrid } from "@/lib/components/shared/ResponsiveGrid";
import { PeopleCard } from "./PeopleCard";
import { PoliticianWithNamnd } from "@/lib/politicians";

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
        <h2 className="text-2xl font-semibold text-foreground mb-4">{title}</h2>
      )}
      <ResponsiveGrid cols={4}>
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
                email={politician.email}
                phone={politician.phone}
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
      </ResponsiveGrid>
    </section>
  );
}
