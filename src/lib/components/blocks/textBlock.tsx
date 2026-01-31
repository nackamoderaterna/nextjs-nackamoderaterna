import { PortableText } from "next-sanity";
import Block from "./Block";
import { BlockHeading, getBlockHeading } from "./BlockHeading";
import { BlockText } from "~/sanity.types";
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
  const { title } = getBlockHeading(blockWithColumns);

  return (
    <Block maxWidth="3xl">
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          {title}
        </h2>
      )}
      <div 
        className={`prose prose-neutral md:prose-lg ${
          columns === 2 
            ? "columns-1 md:columns-2 gap-8" 
            : "columns-1"
        }`}
      >
        {block.content && (
          <PortableText 
            value={block.content} 
            components={portableTextComponents} 
          />
        )}
      </div>
    </Block>
  );
}
