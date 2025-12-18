import { getGridAlignment } from "@/lib/shared/layout/container";
import { themeTextMap } from "@/lib/shared/theme/theme";
import { BlockSettings } from "~/sanity.types";

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
