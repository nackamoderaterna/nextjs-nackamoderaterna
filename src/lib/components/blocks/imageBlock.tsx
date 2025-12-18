import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";

import * as imageBlock from "@/lib/utils/imageBlock";
import Block from "./Block";
import { BlockImage } from "~/sanity.types";

interface ImageBlockProps {
  block: BlockImage;
}

export function ImageBlock({ block }: ImageBlockProps) {
  const { image, caption, aspectRatio = "auto", blockSettings } = block;
  const imageSizes =
    imageBlock.imageSizeMap[block.blockSettings?.contentWidth || "full"];

  if (!image?.asset) return null;

  return (
    <Block settings={blockSettings}>
      <div className="w-full">
        <Image
          src={urlFor(image).url()}
          alt={image.alt || caption || "Media image"}
          width={0}
          height={0}
          sizes={imageSizes}
          className="w-full"
        />
      </div>
    </Block>
  );
}
