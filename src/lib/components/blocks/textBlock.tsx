import { PortableText } from "next-sanity";
import Block from "./Block";
import { proseMap } from "@/lib/shared/theme/theme";
import { BlockText } from "~/sanity.types";

export interface TextBlockProps {
  block: BlockText;
}
export function TextBlock({ block }: TextBlockProps) {
  const columnClass = block.columns === 1 ? "columns-1" : "columns-2";

  return (
    <Block settings={block.blockSettings} applyProse={true}>
      {
        <div className={`${columnClass} w-full`}>
          <div
            className={`prose ${proseMap[block.blockSettings?.theme ?? "light"]}`}
          >
            {block.content && <PortableText value={block.content} />}
          </div>
        </div>
      }
    </Block>
  );
}
