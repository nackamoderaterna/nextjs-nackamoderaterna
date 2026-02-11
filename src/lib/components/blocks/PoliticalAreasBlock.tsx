import Block from "./Block";
import { BlockHeading, getBlockHeading } from "./BlockHeading";
import { PoliticalAreaCard } from "../politics/politicalAreaCard";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import { ROUTE_BASE } from "@/lib/routes";
import { ResponsiveGrid } from "../shared/ResponsiveGrid";

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
    <Block paddingY="large">
      <BlockHeading title={title} subtitle={subtitle} />
      
      <ResponsiveGrid cols={3}>
        {items.map((area) => {
          const slug = area.slug?.current;
          if (!slug || !area.name) return null;
          const Icon = getLucideIcon(area.icon?.name ?? undefined);
          return (
              <PoliticalAreaCard
                title={area.name}
                key={area._id}
                href={`${ROUTE_BASE.POLITICS_CATEGORY}/${slug}`}
                icon={Icon ?? undefined}
              />
          );
          
        })}
        </ResponsiveGrid>
      
    </Block>
  );
}
