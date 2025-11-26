import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { BlockImage } from "../../../lib/sanity/sanity.types";

import { ImageBlockUtils } from "@/lib/utils/imageBlock";
import {
  CONTAINER_MAX_WIDTH,
  CONTAINER_PADDING,
  TEXT_BASE_COL_SPAN,
  TEXT_COLUMN_MAX_WIDTH,
} from "@/lib/utils/layout";
import ContainedBlock from "../core/containedBlock";
import AlignedBlock from "../core/alignedBlock";

interface ImageBlockProps {
  block: BlockImage;
}

export function ImageBlock({ block }: ImageBlockProps) {
  const {
    image,
    caption,
    aspectRatio = "auto",
    width = "full",
    alignment = "left",
  } = block;

  const renderImage = () => {
    if (!image?.asset) return null;

    const useFillLayout = ImageBlockUtils.shouldUseFillLayout(aspectRatio);
    const dimensions = ImageBlockUtils.getImageDimensions(aspectRatio);
    const imageClassName = ImageBlockUtils.getImageClassName(aspectRatio);
    const imageSizes = ImageBlockUtils.getImageSizes(width);

    return (
      <div
        className="overflow-hidden w-full"
        style={{
          aspectRatio: aspectRatio !== "auto" ? aspectRatio : undefined,
        }}
      >
        <Image
          src={urlFor(image).url()}
          alt={image.alt || caption || "Media image"}
          fill={useFillLayout}
          width={dimensions.width}
          height={dimensions.height}
          className={imageClassName}
          sizes={imageSizes}
        />
      </div>
    );
  };

  const colSpanClass = block.width === "contained" ? "col-span-full" : "";

  const renderBlock = () => {
    return (
      <div className={`${colSpanClass} w-full grid gap-2`}>
        {renderImage()}
        <ContainedBlock verticalPadding={false}>
          {caption && (
            <p className={`${TEXT_BASE_COL_SPAN} text-sm text-gray-600`}>
              {caption}
            </p>
          )}
        </ContainedBlock>
      </div>
    );
  };

  const fullBleedImage = () => {
    return <div className="w-full"></div>;
  };

  switch (block.width) {
    case "full":
      return renderBlock();
    case "contained": {
      return <ContainedBlock>{renderBlock()}</ContainedBlock>;
    }
    default: {
      return (
        <AlignedBlock alignment={alignment} reflow={false}>
          {renderBlock()}
        </AlignedBlock>
      );
    }
  }
}
