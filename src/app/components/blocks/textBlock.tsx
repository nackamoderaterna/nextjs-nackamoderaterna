import { getThemeClasses } from "@/app/shared/utils/theme";
import { getTextColumnClasses } from "@/lib/utils/layout";
import { PortableText } from "next-sanity";
import { BlockText } from "../../../../sanity.types";

export function TextBlock({ block }: { block: BlockText }) {
  const theme = getThemeClasses(block?.theme);
  const layout = getTextColumnClasses(block?.textColumns);

  return (
    <div className={`py-12 ${theme.bg} rounded`}>
      <div className={`${layout.container} p-4`}>
        <div className={`${layout.columns}`}>
          <div className={` prose ${theme.prose} p-4 ${theme.text}`}>
            {block.content && <PortableText value={block.content} />}
          </div>
        </div>
      </div>
    </div>
  );
}
