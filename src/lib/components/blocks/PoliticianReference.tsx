import { useMemo } from "react";
import { PeopleCard } from "../politician/PoliticianCardLarge";
import Block from "./Block";
import { Politician } from "~/sanity.types";
import { cleanInvisibleUnicode } from "@/lib/politicians";

const KOMMUNALRAD_ROLE_TITLES: Record<string, string> = {
  president: "Kommunstyrelsens ordförande",
  ordinary: "Kommunalråd",
};

function getDefaultTitle(
  politician: Politician,
  mode: "manual" | "kommunalrad"
): string {
  if (mode === "kommunalrad" && politician.kommunalrad?.active) {
    const rawRole = politician.kommunalrad?.role ?? "ordinary";
    const role = cleanInvisibleUnicode(rawRole) as "president" | "ordinary";
    return KOMMUNALRAD_ROLE_TITLES[role] ?? "Kommunalråd";
  }
  return "Ledamot";
}

type ManualItem = { politician: Politician; titleOverride?: string };

export interface BlockPoliticianDereferenced {
  _type: "block.politician";
  heading?: string;
  mode: "manual" | "kommunalrad";
  items: Politician[] | ManualItem[];
}

export interface PoliticianReferenceBlockProps {
  block: BlockPoliticianDereferenced;
}

export const PoliticianReferenceBlock = ({
  block,
}: PoliticianReferenceBlockProps) => {
  const entries = useMemo(() => {
    const { mode, items } = block;
    if (!items?.length) return [];

    if (mode === "manual") {
      const manualItems = items as ManualItem[];
      return manualItems
        .filter((e): e is ManualItem => !!e.politician)
        .map((e) => ({
          politician: e.politician,
          title:
            e.titleOverride?.trim() ||
            getDefaultTitle(e.politician, "manual"),
        }));
    }

    // For kommunalråd mode, sort to ensure president is first
    const kommunalradItems = [...(items as Politician[])];
    kommunalradItems.sort((a, b) => {
      const aRole = cleanInvisibleUnicode(a.kommunalrad?.role ?? "ordinary");
      const bRole = cleanInvisibleUnicode(b.kommunalrad?.role ?? "ordinary");
      const aIsPresident = aRole === "president";
      const bIsPresident = bRole === "president";
      
      if (aIsPresident && !bIsPresident) return -1;
      if (!aIsPresident && bIsPresident) return 1;
      
      // If both have same role, sort alphabetically
      const nameA = a.name || "";
      const nameB = b.name || "";
      return nameA.localeCompare(nameB, "sv");
    });

    return kommunalradItems.map((p) => ({
      politician: p,
      title: getDefaultTitle(p, "kommunalrad"),
    }));
  }, [block]);

  if (!entries.length) {
    return <p>Inga politiker att visa.</p>;
  }

  return (
    <Block>
        {block.heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {block.heading}
          </h2>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {entries.map(({ politician: p, title }) => (
            <PeopleCard
              slug={p.slug?.current ?? ""}
              key={p._id}
              image={p.image}
              name={p.name}
              title={title}
              size="large"
            />
          ))}
        </div>
    </Block>
  );
};
