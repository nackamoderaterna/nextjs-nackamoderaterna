import { SanityImage } from "../shared/SanityImage";
import Block from "./Block";
import { Politician } from "~/sanity.types";

export interface BlockPoliticianDereferenced {
  _type: "block.politician";
  mode: "manual" | "kommunalrad";
  items: Politician[];
}

export interface PoliticianReferenceBlockProps {
  block: BlockPoliticianDereferenced;
}

export const PoliticianReferenceBlock = ({
  block,
}: PoliticianReferenceBlockProps) => {
  const { items, mode } = block;

  if (!items.length) {
    return <p>Inga politiker att visa.</p>;
  }

  return (
    <Block>
      <div className="grid grid-cols-4">
        {items.map((p) => (
          <div key={p._id} className="rounded p-3">
            <SanityImage image={p.image} />
            <h3 className="font-bold">{p.name}</h3>
            <a
              href={`/politiker/${p.slug?.current}`}
              className="text-blue-600 hover:underline"
            >
              Läs mer
            </a>
          </div>
        ))}
      </div>
    </Block>
  );
};
