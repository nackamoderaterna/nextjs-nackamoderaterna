import { PeopleCard } from "../politician/PoliticianCardLarge";
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
  const { items } = block;

  if (!items.length) {
    return <p>Inga politiker att visa.</p>;
  }

  return (
    <Block>
      <div className="grid lg:grid-cols-4 gap-4">
        {items.map((p) => (
          <PeopleCard
            key={p._id}
            image={p.image}
            name={p.name}
            title={"-"}
            size="large"
          />
        ))}
      </div>
    </Block>
  );
};
