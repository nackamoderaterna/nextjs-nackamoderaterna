import { getGridAlignment } from "@/app/shared/layout/container";
import { themeTextMap } from "@/app/shared/theme/theme";
import { BlockSettings } from "@/lib/sanity/sanity.types";

export type ContentProps = {
  settings?: BlockSettings;
  children?: React.ReactNode;
};

export default function Content({ settings, children }: ContentProps) {
  const text = themeTextMap[settings?.theme ?? "light"];

  const placement = getGridAlignment({
    width: settings?.contentWidth ?? "wide",
    containerAlignment: settings?.blockPlacement ?? "left",
  });
  return (
    <div
      className={`${placement} ${text} 
          `}
    >
      {children}
    </div>
  );
}
