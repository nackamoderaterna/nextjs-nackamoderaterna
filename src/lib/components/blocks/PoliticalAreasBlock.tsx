import Block from "./Block";
import { BlockHeading, getBlockHeading } from "./BlockHeading";
import { PoliticalAreaCard } from "../politics/politicalAreaCard";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import { ROUTE_BASE } from "@/lib/routes";

interface PoliticalAreasBlockProps {
  _type: "block.politicalAreas";
  heading?: { title?: string | null; subtitle?: string | null };
  items?: Array<{
    _id: string;
    name?: string | null;
    slug?: { current?: string | null } | null;
    icon?: { name?: string | null } | null;
  }>;
}

export function PoliticalAreasBlock({ block }: { block: PoliticalAreasBlockProps }) {
  const { title, subtitle } = getBlockHeading(block);
  const { items } = block;

  if (!items?.length) {
    return null;
  }

  return (
    <Block paddingY="large" maxWidth="6xl">
      <BlockHeading title={title} subtitle={subtitle} />
      <div className="flex flex-wrap justify-center gap-4">
        {items.map((area) => {
          const slug = area.slug?.current;
          if (!slug || !area.name) return null;
          const Icon = getLucideIcon(area.icon?.name ?? undefined);
          return (
            <div
              key={area._id}
              className="w-[calc(50%-0.5rem)] shrink-0 lg:w-[calc(25%-0.75rem)]"
            >
              <PoliticalAreaCard
                title={area.name}
                href={`${ROUTE_BASE.POLITICS}/${slug}`}
                icon={Icon ?? undefined}
              />
            </div>
          );
        })}
      </div>
    </Block>
  );
}
