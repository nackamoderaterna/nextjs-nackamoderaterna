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

export function ImageGalleryBlock({ block }: { block: ImageGalleryBlockProps }) {
  const columns = block.columns || 3;
  const aspectRatio = block.aspectRatio || "square";

  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  const aspectClasses = {
    square: "aspect-square",
    landscape: "aspect-video",
    portrait: "aspect-[4/5]",
    auto: "aspect-auto",
  };

  return (
    <Block>
      <div className="max-w-7xl mx-auto">
        {block.heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {block.heading}
          </h2>
        )}
        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4 md:gap-6`}>
          {block.images?.map((image, index) => (
            <div key={image._key || index} className="space-y-2">
              <div
                className={`relative rounded-lg overflow-hidden ${aspectClasses[aspectRatio]} ${
                  aspectRatio === "auto" ? "" : ""
                }`}
              >
                <SanityImage
                  image={image}
                  alt={image.alt || ""}
                  fill={aspectRatio !== "auto"}
                  sizes={
                    columns === 2
                      ? "(max-width: 768px) 100vw, 50vw"
                      : columns === 3
                      ? "(max-width: 768px) 100vw, 33vw"
                      : "(max-width: 768px) 100vw, 25vw"
                  }
                  className={aspectRatio === "auto" ? "w-full h-auto" : "object-cover"}
                />
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
