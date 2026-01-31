import Block from "./Block";
import { BlockHeading, getBlockHeading } from "./BlockHeading";
import { SanityImage } from "../shared/SanityImage";

interface ImageGalleryBlockProps {
  _type: "block.imageGallery";
  heading?: { title?: string | null; subtitle?: string | null } | string;
  images?: Array<{
    _key?: string;
    asset?: any;
    alt?: string;
    caption?: string;
    aspectRatio?: "default" | "portrait" | "square" | "landscape" | "auto";
  }>;
  columns?: 2 | 3 | 4;
  aspectRatio?: "square" | "landscape" | "portrait" | "auto";
}

// Helper function to clean invisible Unicode characters
const cleanString = (str?: string | null): string => {
  if (!str) return "";
  return String(str)
    .trim()
    .replace(/[\u200B-\u200D\uFEFF\u00AD\u200C\u200D]/g, '')
    .replace(/[\u2060-\u206F]/g, '')
    .trim();
};

const ASPECT_CLASSES: Record<string, string> = {
  square: "aspect-square",
  landscape: "aspect-video",
  portrait: "aspect-[4/5]",
  auto: "aspect-auto",
};

export function ImageGalleryBlock({ block }: { block: ImageGalleryBlockProps }) {
  const columns = block.columns || 3;
  const blockAspectRatio = cleanString(block.aspectRatio) as "square" | "landscape" | "portrait" | "auto" || "portrait";
  const defaultAspect = blockAspectRatio || "portrait";
  const { title } = getBlockHeading(block);
  const headingTitle = cleanString(title);

  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  const getAspectForImage = (image: NonNullable<typeof block.images>[number] | undefined) => {
    const imgRatio = cleanString(image?.aspectRatio);
    if (!imgRatio || imgRatio === "default") return defaultAspect;
    return imgRatio as keyof typeof ASPECT_CLASSES;
  };

  // Filter out images without assets
  const validImages = block.images?.filter((image) => {
    // Check if image has an asset (can be reference or resolved)
    return image && (image.asset?._ref || image.asset?._id || image.asset?.url);
  }) || [];



  if (validImages.length === 0) {
    if (process.env.NODE_ENV === "development") {
      console.warn("ImageGalleryBlock: No valid images found", {
        imagesCount: block.images?.length || 0,
        images: block.images,
      });
    }
    return null;
  }

  return (
    <Block>
        <BlockHeading title={headingTitle || undefined} />
        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4 md:gap-6`}>
          {validImages.map((image, index) => {
            const imageAspect = getAspectForImage(image);
            const aspectClass = ASPECT_CLASSES[imageAspect] || ASPECT_CLASSES.portrait;
            const useAuto = imageAspect === "auto";

            return (
            <div key={image._key || index} className="space-y-2">
              <div
                className={`relative w-full rounded-lg overflow-hidden ${
                  !useAuto ? aspectClass : ""
                }`}
              >
                {useAuto ? (
                  <SanityImage
                    image={image}
                    alt={image.alt || ""}
                    fill={false}
                    width={800}
                    height={600}
                    sizes={
                      columns === 2
                        ? "(max-width: 768px) 100vw, 50vw"
                        : columns === 3
                        ? "(max-width: 768px) 100vw, 33vw"
                        : "(max-width: 768px) 100vw, 25vw"
                    }
                    className="w-full h-auto"
                  />
                ) : (
                  <SanityImage
                    image={image}
                    alt={image.alt || ""}
                    fill={true}
                    sizes={
                      columns === 2
                        ? "(max-width: 768px) 100vw, 50vw"
                        : columns === 3
                        ? "(max-width: 768px) 100vw, 33vw"
                        : "(max-width: 768px) 100vw, 25vw"
                    }
                    className="object-cover"
                  />
                )}
              </div>
              {image.caption && (
                <p className="text-sm text-muted-foreground text-center">
                  {image.caption}
                </p>
              )}
            </div>
          );
          })}
        </div>
    </Block>
  );
}
