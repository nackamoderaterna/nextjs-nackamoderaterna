import { PortableText } from "next-sanity";
import Block from "./Block";
import { BlockText } from "~/sanity.types";

type BlockTextWithColumns = BlockText & { columns?: number };

export interface TextBlockProps {
  block: BlockText;
}
export function TextBlock({ block }: TextBlockProps) {
  const columns = (block as BlockTextWithColumns).columns;
  const columnClass = columns === 2 ? "columns-2" : "columns-1";

  return (
    <Block>
      <div className={`${columnClass} max-w-3xl mx-auto`}>
        <div className={`prose prose-neutral md:prose-lg`}>
          {block.content && <PortableText value={block.content} />}
        </div>
      </div>
    </Block>
  );
}
