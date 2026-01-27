import Block from "./Block";
import { SanityImage } from "../shared/SanityImage";

interface QuoteBlockProps {
  _type: "block.quote";
  heading?: string;
  quote: string;
  author?: string;
  authorTitle?: string;
  authorImage?: any;
  alignment?: "left" | "center" | "right";
}

export function QuoteBlock({ block }: { block: QuoteBlockProps }) {
  const alignment = block.alignment || "center";

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

  return (
    <Block>
      <div className="max-w-7xl mx-auto">
        {block.heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {block.heading}
          </h2>
        )}
        <div className={`max-w-4xl mx-auto ${alignClass} flex flex-col ${flexAlignClass}`}>
          <blockquote className="text-2xl md:text-3xl font-light italic mb-8 leading-relaxed">
            "{block.quote}"
          </blockquote>
        {(block.author || block.authorImage) && (
          <div className={`flex items-center gap-4 ${alignment === "right" ? "flex-row-reverse" : ""}`}>
            {block.authorImage && (
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <SanityImage
                  image={block.authorImage}
                  alt={block.author || ""}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            )}
            <div>
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
      </div>
    </Block>
  );
}
