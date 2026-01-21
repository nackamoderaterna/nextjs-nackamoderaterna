import { PortableText } from "next-sanity";
import Block from "./Block";
import { SanityImage } from "../shared/SanityImage";

interface TwoColumnBlockProps {
  _type: "block.twoColumn";
  leftContent?: any[];
  rightContent?: any[];
  leftImage?: any;
  rightImage?: any;
  reverse?: boolean;
  verticalAlignment?: "top" | "center" | "bottom";
}

export function TwoColumnBlock({ block }: { block: TwoColumnBlockProps }) {
  const reverse = block.reverse || false;
  const alignment = block.verticalAlignment || "top";

  const alignClasses = {
    top: "items-start",
    center: "items-center",
    bottom: "items-end",
  };

  const leftColumn = (
    <div className="space-y-4">
      {block.leftImage && (
        <div className="rounded-lg overflow-hidden">
          <SanityImage
            image={block.leftImage}
            alt={block.leftImage.alt || ""}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-auto"
          />
        </div>
      )}
      {block.leftContent && (
        <div className="prose prose-neutral max-w-none">
          <PortableText value={block.leftContent} />
        </div>
      )}
    </div>
  );

  const rightColumn = (
    <div className="space-y-4">
      {block.rightImage && (
        <div className="rounded-lg overflow-hidden">
          <SanityImage
            image={block.rightImage}
            alt={block.rightImage.alt || ""}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-auto"
          />
        </div>
      )}
      {block.rightContent && (
        <div className="prose prose-neutral max-w-none">
          <PortableText value={block.rightContent} />
        </div>
      )}
    </div>
  );

  return (
    <Block>
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 ${alignClasses[alignment]}`}
        >
          {reverse ? (
            <>
              {rightColumn}
              {leftColumn}
            </>
          ) : (
            <>
              {leftColumn}
              {rightColumn}
            </>
          )}
        </div>
      </div>
    </Block>
  );
}
