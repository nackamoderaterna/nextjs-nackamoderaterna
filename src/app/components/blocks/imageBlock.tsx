import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { BlockImage } from "../../../lib/sanity/sanity.types";

import { ImageBlockUtils } from "@/lib/utils/imageBlock";
import { TEXT_COLUMN_MAX_WIDTH } from "@/lib/utils/layout";

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
      <Image
        src={urlFor(image).url()}
        alt={image.alt || caption || "Media image"}
        fill={useFillLayout}
        width={dimensions.width}
        height={dimensions.height}
        className={imageClassName}
        sizes={imageSizes}
      />
    );
  };

  return (
    <div className={ImageBlockUtils.getBlockContainerClasses()}>
      <div
        className={ImageBlockUtils.getContentConstraintClasses(
          alignment,
          width,
        )}
      >
        <div className={ImageBlockUtils.getImageContainerClasses(width)}>
          <div
            className={ImageBlockUtils.getImageClasses(width)}
            style={{
              aspectRatio: aspectRatio !== "auto" ? aspectRatio : undefined,
            }}
          >
            {renderImage()}
          </div>

          {caption && (
            <p
              className={`${TEXT_COLUMN_MAX_WIDTH} w-full mt-3 text-sm text-gray-600`}
            >
              {caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
