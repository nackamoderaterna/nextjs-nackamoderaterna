import Block from "./Block";
import { SanityImage } from "../shared/SanityImage";

interface ImageGalleryBlockProps {
  _type: "block.imageGallery";
  heading?: string;
  images?: Array<{
    _key?: string;
    asset?: any;
    alt?: string;
    caption?: string;
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

export function ImageGalleryBlock({ block }: { block: ImageGalleryBlockProps }) {
  const columns = block.columns || 3;
  const rawAspectRatio = block.aspectRatio || "square";
  const aspectRatio = cleanString(rawAspectRatio) as "square" | "landscape" | "portrait" | "auto" || "square";
  const heading = cleanString(block.heading);

  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  const aspectClasses: Record<string, string> = {
    square: "aspect-square",
    landscape: "aspect-video",
    portrait: "aspect-[4/5]",
    auto: "aspect-auto",
  };
  
  // Get the aspect ratio class, defaulting to square if invalid
  const aspectClass = aspectClasses[aspectRatio] || aspectClasses.square;

  // Filter out images without assets
  const validImages = block.images?.filter((image) => {
    // Check if image has an asset (can be reference or resolved)
    return image && (image.asset?._ref || image.asset?._id || image.asset?.url);
  }) || [];

  // Debug logging
  if (process.env.NODE_ENV === "development" && block.images) {
    console.log("ImageGalleryBlock - block:", {
      heading,
      columns,
      aspectRatio,
      imagesCount: block.images.length,
      validImagesCount: validImages.length,
      firstImage: block.images[0] ? {
        _key: block.images[0]._key,
        hasAsset: !!block.images[0].asset,
        asset: block.images[0].asset,
        assetKeys: block.images[0].asset ? Object.keys(block.images[0].asset) : [],
      } : null,
    });
  }

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
      <div className="max-w-7xl mx-auto">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {heading}
          </h2>
        )}
        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4 md:gap-6`}>
          {validImages.map((image, index) => (
            <div key={image._key || index} className="space-y-2">
              <div
                className={`relative w-full rounded-lg overflow-hidden ${
                  aspectRatio !== "auto" ? aspectClass : ""
                }`}
              >
                {aspectRatio === "auto" ? (
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
          ))}
        </div>
      </div>
    </Block>
  );
}
