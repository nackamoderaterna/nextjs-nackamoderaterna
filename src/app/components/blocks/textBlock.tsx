import { PortableText } from "next-sanity";
import ContainedBlock from "../core/containedBlock";
import AlignedBlock from "../core/alignedBlock";
import { BlockSettings, BlockText } from "@/lib/sanity/sanity.types";
import Block from "./Block";
import { proseMap } from "@/app/shared/theme/theme";

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
