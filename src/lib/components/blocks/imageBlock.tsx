import Block from "./Block";
import { BlockImage } from "~/sanity.types";
import { SanityImage } from "../shared/SanityImage";

interface ImageBlockProps {
  block: BlockImage;
}

export function ImageBlock({ block }: ImageBlockProps) {
  const heading = (block as any).heading;
  
  return (
    <Block>
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {heading}
          </h2>
        )}
        <SanityImage image={block.image} />
    </Block>
  );
}
