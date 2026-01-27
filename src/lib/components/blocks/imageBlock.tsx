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
      <div className="w-full max-w-7xl mx-auto">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {heading}
          </h2>
        )}
        <SanityImage image={block.image} />
      </div>
    </Block>
  );
}
