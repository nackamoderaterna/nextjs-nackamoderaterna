import { getThemeClasses } from "@/app/shared/utils/theme";
import {
  CONTAINER_MAX_WIDTH,
  CONTAINER_PADDING,
  getContainerClasses,
  getTextColumnClasses,
} from "@/lib/utils/layout";
import { PortableText } from "next-sanity";
import { BlockText } from "../../../../sanity.types";

export function TextBlock({ block }: { block: BlockText }) {
  const theme = getThemeClasses(block?.theme);
  const layout = getTextColumnClasses(block?.textColumns);
  const containerClasses = getContainerClasses(block?.containerWidth);

  const padding = block.theme && block.theme !== "default" ? "px-4" : "";

  return (
    <div className={`w-full ${CONTAINER_PADDING}`}>
      <div
        className={`py-12 flex justify-center ${containerClasses} ${theme.bg} ${padding}`}
      >
        <div className={`${layout.columns} ${layout.container}`}>
          <div className={` prose ${theme.prose} ${theme.text}`}>
            {block.content && <PortableText value={block.content} />}
          </div>
        </div>
      </div>
    </div>
  );
}
