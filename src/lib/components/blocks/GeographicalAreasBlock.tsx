import Block from "./Block";
import { GeographicalAreaCard } from "../politics/geographicalAreaCard";

interface GeographicalAreasBlockProps {
  _type: "block.geographicalAreas";
  heading?: string;
  description?: string;
  items?: Array<{
    _id: string;
    name?: string | null;
    slug?: { current?: string | null } | null;
    image?: unknown;
  }>;
}

export function GeographicalAreasBlock({ block }: { block: GeographicalAreasBlockProps }) {
  const { heading, description, items } = block;

  if (!items?.length) {
    return null;
  }

  return (
    <Block paddingY="large" maxWidth="6xl">
      {(heading || description) && (
        <div className="mb-8 text-center">
          {heading && (
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{heading}</h2>
          )}
          {description && (
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
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
