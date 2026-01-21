import { PeopleCard } from "./PoliticianCardLarge";
import { PoliticianCardSmall } from "./PoliticianCardSmall";
import { PoliticianWithNamnd } from "@/lib/politicians";

interface PoliticianSectionProps {
  title: string;
  politicians: PoliticianWithNamnd[];
  cardType: "large" | "small";
  positionTitle?: string;
}

export function PoliticianSection({
  title,
  politicians,
  cardType,
  positionTitle,
}: PoliticianSectionProps) {
  if (politicians.length === 0) {
    return null;
  }

  return (
    <section className="mb-10">
      {title && (
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {politicians.map((politician) => {
          if (cardType === "large") {
            return (
              <PeopleCard
                key={politician._id}
                slug={politician.slug?.current || ""}
                image={politician.image}
                name={politician.name}
                title={positionTitle}
                size="large"
              />
            );
          }
          return (
            <PoliticianCardSmall
              key={politician._id}
              name={politician.name}
              image={politician.image}
              subtitle={positionTitle || ""}
            />
          );
        })}
      </div>
    </section>
  );
}
