import Block from "./Block";
import { BlockHeading, getBlockHeading } from "./BlockHeading";
import { BlockImage } from "~/sanity.types";
import { SanityImage } from "../shared/SanityImage";

interface ImageBlockProps {
  block: BlockImage;
}

export function ImageBlock({ block }: ImageBlockProps) {
  const { title } = getBlockHeading(block as Record<string, unknown>);

  return (
    <Block>
        <BlockHeading title={title} />
        <SanityImage image={block.image} />
    </Block>
  );
}
