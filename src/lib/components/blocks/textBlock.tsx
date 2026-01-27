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
  const heading = (block as any).heading;

  return (
    <Block>
      <div className="max-w-7xl mx-auto">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {heading}
          </h2>
        )}
        <div className={`${columnClass} max-w-3xl mx-auto`}>
          <div className={`prose prose-neutral md:prose-lg`}>
            {block.content && <PortableText value={block.content} />}
          </div>
        </div>
      </div>
    </Block>
  );
}
