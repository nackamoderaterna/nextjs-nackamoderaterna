import { PortableText } from "next-sanity";
import Block from "./Block";
import { getBlockHeading } from "./BlockHeading";
import { HeadingAnchorLink } from "./HeadingAnchorLink";
import { BlockText } from "~/sanity.types";
import { cn } from "@/lib/utils";
import { portableTextComponents } from "../shared/PortableTextComponents";

type BlockTextWithColumns = BlockText & {
  columns?: number;
  heading?: { title?: string | null; subtitle?: string | null } | string;
  description?: string;
};

export interface TextBlockProps {
  block: BlockText;
}
export function TextBlock({ block }: TextBlockProps) {
  const blockWithColumns = block as BlockTextWithColumns;
  const columns = blockWithColumns.columns ?? 1;
  const { title, anchorId } = getBlockHeading(blockWithColumns);

  return (
    <Block>
      <div className="max-w-3xl mx-auto">
        {title && (
          <h2
            id={anchorId ?? undefined}
            className={cn(
              "text-3xl md:text-4xl font-bold mb-8 text-center scroll-mt-24",
              anchorId && "group inline-flex items-center gap-2 justify-center w-full"
            )}
          >
            {title}
            <HeadingAnchorLink anchorId={anchorId} />
          </h2>
        )}
        <div
          className={
            columns === 2 ? "columns-1 md:columns-2 gap-8" : ""
          }
        >
          {block.content && (
            <PortableText
              value={block.content}
              components={portableTextComponents}
            />
          )}
        </div>
      </div>
    </Block>
  );
}
