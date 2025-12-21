import { PortableText } from "next-sanity";
import Block from "./Block";
import { BlockText } from "~/sanity.types";

export interface TextBlockProps {
  block: BlockText;
}
export function TextBlock({ block }: TextBlockProps) {
  const columnClass = block.columns === 1 ? "columns-1" : "columns-2";

  return (
    <Block>
      <div className={`${columnClass} w-full`}>
        <div className={`prose`}>
          {block.content && <PortableText value={block.content} />}
        </div>
      </div>
    </Block>
  );
}
