import { getThemeClasses } from "@/app/shared/utils/theme";
import { getTextColumnClasses } from "@/lib/utils/layout";
import { PortableText } from "next-sanity";
import ContainedBlock from "../core/containedBlock";
import AlignedBlock from "../core/alignedBlock";
import { BlockText } from "@/lib/sanity/sanity.types";

export function TextBlock({ block }: { block: BlockText }) {
  const theme = getThemeClasses(block?.theme);
  const columnClass = block.columns === 1 ? "columns-1" : "columns-2";

  const renderText = () => {
    return (
      <div className="col-span-full">
        <div className={`${columnClass} w-full`}>
          <div className={`prose ${theme.prose}`}>
            {block.content && <PortableText value={block.content} />}
          </div>
        </div>
      </div>
    );
  };

  if (block.columns === 2) {
    return <ContainedBlock>{renderText()}</ContainedBlock>;
  }
  return (
    <AlignedBlock alignment={block.alignment!} reflow={false}>
      {renderText()}
    </AlignedBlock>
  );
}
