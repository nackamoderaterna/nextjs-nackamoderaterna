import { getThemeClasses, Theme } from "@/app/shared/utils/theme";
import { CONTAINER_MAX_WIDTH, CONTAINER_PADDING } from "@/lib/utils/layout";
import { Children } from "react";

export default function ContainedBlock({
  children,
  theme = "default",
  verticalPadding = true,
}: {
  children: React.ReactNode;
  verticalPadding?: boolean;
  theme?: Theme;
}) {
  const themeClasses = getThemeClasses(theme);
  return (
    <div
      className={`max-w-6xl ${verticalPadding ? "py-12" : ""} mx-auto grid grid-cols-12 gap-2 w-full`}
    >
      {children}
    </div>
  );
}
