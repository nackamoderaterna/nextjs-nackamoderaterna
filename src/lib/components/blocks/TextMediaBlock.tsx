import { PortableText } from "next-sanity";
import Block from "./Block";
import { BlockHeading, getBlockHeading } from "./BlockHeading";
import { SanityImage } from "../shared/SanityImage";
import { portableTextComponents } from "../shared/PortableTextComponents";

interface TwoColumnBlockProps {
  _type: "block.twoColumn";
  heading?: { title?: string | null; subtitle?: string | null } | string;
  innerTitle?: string | null;
  image: any;
  content: any[];
  imagePosition?: "left" | "right";
  verticalAlignment?: "top" | "center" | "bottom";
  textAlignment?: "left" | "center" | "right";
}

export function TextMediaBlock({ block }: { block: TwoColumnBlockProps }) {
  const imagePosition = block.imagePosition || "left";
  const verticalAlignment = block.verticalAlignment || "top";
  const textAlignment = block.textAlignment || "left";

  const verticalAlignClasses = {
    top: "items-start",
    center: "items-center",
    bottom: "items-end",
  };

  const textAlignClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  const imageColumn = (
    <div className="rounded overflow-hidden relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-68">
      <SanityImage
        image={block.image}
        alt={block.image?.alt || ""}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );

  const { title, subtitle } = getBlockHeading(block);

  const textColumn = (
    <div
      className={`flex flex-col gap-4 py-8 lg:py-16 ${textAlignClasses[textAlignment]}`}
    >
      {block.innerTitle && (
        <h3 className="text-xl font-semibold md:text-2xl">
          {block.innerTitle}
        </h3>
      )}
      <div
        className={`prose prose-neutral max-w-none ${textAlignment === "center" ? "mx-auto" : ""}`}
      >
        <PortableText
          value={block.content}
          components={portableTextComponents}
        />
      </div>
    </div>
  );

  return (
    <Block>
      <BlockHeading
        title={title}
        subtitle={subtitle}
        centered={textAlignment === "center"}
      />
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 ${verticalAlignClasses[verticalAlignment]}`}
      >
        {imagePosition === "right" ? (
          <>
            {textColumn}
            {imageColumn}
          </>
        ) : (
          <>
            {imageColumn}
            {textColumn}
          </>
        )}
      </div>
    </Block>
  );
}
