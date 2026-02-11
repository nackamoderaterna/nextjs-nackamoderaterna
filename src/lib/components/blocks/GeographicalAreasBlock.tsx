import Block from "./Block";
import { BlockHeading, getBlockHeading } from "./BlockHeading";
import { GeographicalAreaCard } from "../politics/geographicalAreaCard";
import { ResponsiveGrid } from "../shared/ResponsiveGrid";

interface GeographicalAreasBlockProps {
  _type: "block.geographicalAreas";
  heading?: { title?: string | null; subtitle?: string | null };
  items?: Array<{
    _id: string;
    name?: string | null;
    slug?: { current?: string | null } | null;
    image?: unknown;
  }>;
}

export function GeographicalAreasBlock({ block }: { block: GeographicalAreasBlockProps }) {
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
          return (
            
              <GeographicalAreaCard
                title={area.name}
                image={area.image}
                slug={slug}
                key={area._id}
              />
          );
        })}
      </ResponsiveGrid>
    </Block>
  );
}
