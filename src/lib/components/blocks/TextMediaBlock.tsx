import { PortableText } from "next-sanity";
import Block from "./Block";
import { BlockHeading, getBlockHeading } from "./BlockHeading";
import { SanityImage } from "../shared/SanityImage";
import { portableTextComponents } from "../shared/PortableTextComponents";
import { cleanInvisibleUnicode } from "@/lib/politicians";

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
  const imagePosition =
    (cleanInvisibleUnicode(block.imagePosition) as "left" | "right") ||
    "left";
  const verticalAlignment =
    (cleanInvisibleUnicode(block.verticalAlignment) as
      | "top"
      | "center"
      | "bottom") || "top";
  const textAlignment =
    (cleanInvisibleUnicode(block.textAlignment) as
      | "left"
      | "center"
      | "right") || "left";

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

  const { title, subtitle, anchorId } = getBlockHeading(block);

  const textColumn = (
    <div
      className={`flex flex-col gap-4 pb-8 lg:py-16 ${textAlignClasses[textAlignment]}`}
    >
      {block.innerTitle && (
        <h3 className="text-xl font-semibold md:text-2xl">
          {block.innerTitle}
        </h3>
      )}
      <div
        className={textAlignment === "center" ? "mx-auto" : ""}
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
        anchorId={anchorId}
        centered={textAlignment === "center"}
      />
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 ${verticalAlignClasses[verticalAlignment]}`}
      >
        <div className="order-first md:order-none h-full">{imageColumn}</div>
        <div
          className={`order-last ${imagePosition === "right" ? "md:order-first" : "md:order-none"}`}
        >
          {textColumn}
        </div>
      </div>
    </Block>
  );
}
