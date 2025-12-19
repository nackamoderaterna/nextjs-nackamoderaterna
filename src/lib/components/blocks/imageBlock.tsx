import Image from "next/image";

import * as imageBlock from "@/lib/utils/imageBlock";
import Block from "./Block";
import { BlockImage } from "~/sanity.types";
import { SanityImage } from "../shared/SanityImage";

interface ImageBlockProps {
  block: BlockImage;
}

export function ImageBlock({ block }: ImageBlockProps) {
  return (
    <Block>
      <div className="w-full">
        <SanityImage image={block.image} />
      </div>
    </Block>
  );
}
