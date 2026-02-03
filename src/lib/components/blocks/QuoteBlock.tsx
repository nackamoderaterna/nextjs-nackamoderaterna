import Block from "./Block";
import { BlockHeading, getBlockHeading } from "./BlockHeading";
import { SanityImage } from "../shared/SanityImage";
import { cleanInvisibleUnicode } from "@/lib/politicians";

interface QuoteBlockProps {
  _type: "block.quote";
  heading?: { title?: string | null; subtitle?: string | null } | string;
  quote: string;
  author?: string;
  authorTitle?: string;
  authorImage?: any;
  alignment?: "left" | "center" | "right";
}

export function QuoteBlock({ block }: { block: QuoteBlockProps }) {
  const alignment =
    (cleanInvisibleUnicode(block.alignment) as "left" | "right" | "center") ||
    "center";

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const flexAlignmentClasses = {
    left: "items-start",
    center: "items-center",
    right: "items-end",
  };

  const alignClass = alignmentClasses[alignment];
  const flexAlignClass = flexAlignmentClasses[alignment];

  const { title } = getBlockHeading(block);

  return (
    <Block maxWidth="3xl">
      <BlockHeading title={title} />
      <div className={`${alignClass} flex flex-col ${flexAlignClass}`}>
        <blockquote className="text-2xl font-serif md:text-3xl font-light italic mb-8 leading-relaxed">
          "{block.quote}"
        </blockquote>
        {(block.author || block.authorImage) && (
          <div
            className={`flex items-center gap-4 ${alignment === "right" ? "flex-row-reverse" : ""}`}
          >
            {block.authorImage && (
              <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                <SanityImage
                  image={block.authorImage}
                  alt={block.author || ""}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="text-left">
              {block.author && (
                <div className="font-semibold">{block.author}</div>
              )}
              {block.authorTitle && (
                <div className="text-sm text-muted-foreground">
                  {block.authorTitle}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Block>
  );
}
