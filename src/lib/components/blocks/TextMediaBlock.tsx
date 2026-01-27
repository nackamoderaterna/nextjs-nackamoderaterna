import { PortableText } from "next-sanity";
import Block from "./Block";
import { SanityImage } from "../shared/SanityImage";
import { portableTextComponents } from "../shared/PortableTextComponents";
import { cleanInvisibleUnicode } from "@/lib/politicians";

interface TwoColumnBlockProps {
  _type: "block.twoColumn";
  heading?: string;
  image: any;
  content: any[];
  imagePosition?: "left" | "right";
  verticalAlignment?: "top" | "center" | "bottom";
}

export function TextMediaBlock({ block }: { block: TwoColumnBlockProps }) {
  const imagePosition = block.imagePosition || "left";
  const alignment = block.verticalAlignment || "top";

  const alignClasses = {
    top: "items-start",
    center: "items-center",
    bottom: "items-end",
  };

  const imageColumn = (
    <div className="rounded-lg overflow-hidden">
      <SanityImage
        image={block.image}
        alt={block.image?.alt || ""}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="w-full h-auto"
      />
    </div>
  );

  const textColumn = (
    <div className="prose prose-neutral max-w-none">
      <PortableText value={block.content} components={portableTextComponents} />
    </div>
  );

  return (
    <Block>
        {block.heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {block.heading}
          </h2>
        )}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 ${alignClasses[cleanInvisibleUnicode(alignment) as "top" | "center" | "bottom"]}`}
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
