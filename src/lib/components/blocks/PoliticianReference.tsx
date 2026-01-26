import { useMemo } from "react";
import { PeopleCard } from "../politician/PoliticianCardLarge";
import Block from "./Block";
import { Politician } from "~/sanity.types";

const KOMMUNALRAD_ROLE_TITLES: Record<string, string> = {
  president: "Kommunstyrelsens ordförande",
  ordinary: "Kommunalråd",
};

function getDefaultTitle(
  politician: Politician,
  mode: "manual" | "kommunalrad"
): string {
  if (mode === "kommunalrad" && politician.kommunalrad?.active) {
    const role = (politician.kommunalrad as { role?: string }).role ?? "ordinary";
    return KOMMUNALRAD_ROLE_TITLES[role] ?? "Kommunalråd";
  }
  return "–";
}

type ManualItem = { politician: Politician; titleOverride?: string };
type TitleOverrideEntry = { politicianId: string; titleOverride: string };

export interface BlockPoliticianDereferenced {
  _type: "block.politician";
  mode: "manual" | "kommunalrad";
  items: Politician[] | ManualItem[];
  titleOverrides?: TitleOverrideEntry[];
}

export interface PoliticianReferenceBlockProps {
  block: BlockPoliticianDereferenced;
}

export const PoliticianReferenceBlock = ({
  block,
}: PoliticianReferenceBlockProps) => {
  const entries = useMemo(() => {
    const { mode, items, titleOverrides } = block;
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

    const overridesMap = new Map(
      (titleOverrides ?? []).map((o) => [o.politicianId, o.titleOverride])
    );
    return (items as Politician[]).map((p) => ({
      politician: p,
      title:
        overridesMap.get(p._id)?.trim() ||
        getDefaultTitle(p, "kommunalrad"),
    }));
  }, [block]);

  if (!entries.length) {
    return <p>Inga politiker att visa.</p>;
  }

  return (
    <Block>
      <div className="grid lg:grid-cols-4 gap-4">
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
