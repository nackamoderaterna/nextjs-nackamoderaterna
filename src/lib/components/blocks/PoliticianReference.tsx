import { useMemo } from "react";
import Block from "./Block";
import { BlockHeading, getBlockHeading } from "./BlockHeading";
import { Politician } from "~/sanity.types";
import { cleanInvisibleUnicode } from "@/lib/politicians";
import { PeopleCard } from "../politician/PeopleCard";

type PoliticianWithLivingArea = Politician & {
  livingArea?: { _id: string; name: string; slug?: { current: string } } | null;
  email?: string | null;
  phone?: string | null;
};

function getDefaultTitle(
  politician: PoliticianWithLivingArea,
  mode: "manual" | "kommunalrad"
): string {
  if (mode === "kommunalrad") {
    return politician.livingArea?.name ?? "";
  }
  return "Ledamot";
}

type ManualItem = { politician: PoliticianWithLivingArea; titleOverride?: string };

export interface BlockPoliticianDereferenced {
  _type: "block.politician";
  heading?: { title?: string | null; subtitle?: string | null } | string;
  mode: "manual" | "kommunalrad";
  items: PoliticianWithLivingArea[] | ManualItem[];
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
    const kommunalradItems = [...(items as PoliticianWithLivingArea[])];
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

  const { title } = getBlockHeading(block);

  return (
    <Block>
        <BlockHeading title={title} />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {entries.map(({ politician: p, title }) => (
            <PeopleCard
              slug={p.slug?.current ?? ""}
              key={p._id}
              image={p.image}
              name={p.name}
              title={title}
              size="large"
              email={p.email}
              phone={p.phone}
            />
          ))}
        </div>
    </Block>
  );
};
