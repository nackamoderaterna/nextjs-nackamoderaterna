import Block from "./Block";
import { BlockHeading, getBlockHeading } from "./BlockHeading";
import { GeographicalAreaCard } from "../politics/geographicalAreaCard";

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
    <Block paddingY="large" maxWidth="6xl">
      <BlockHeading title={title} subtitle={subtitle} />
      <div className="flex flex-wrap justify-center gap-4">
        {items.map((area) => {
          const slug = area.slug?.current;
          if (!slug || !area.name) return null;
          return (
            <div
              key={area._id}
              className="w-full shrink-0 md:w-[calc(50%-0.5rem)]"
            >
              <GeographicalAreaCard
                title={area.name}
                image={area.image}
                slug={slug}
              />
            </div>
          );
        })}
      </div>
    </Block>
  );
}
