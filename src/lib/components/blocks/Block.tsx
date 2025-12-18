import { BlockSettings } from "~/sanity.types";
import Container from "./Container";
import Content from "./Content";
import { Themable } from "./Themable";

export type BlockProps = {
  settings?: BlockSettings;
  applyBackground?: boolean;
  applyProse?: boolean;
  children: React.ReactNode;
};

export default function Block({
  settings,
  children,
  applyBackground = true,
  applyProse = true,
}: BlockProps) {
  const {
    theme,
    containerWidth,
    contentAlignment,
    blockPlacement,
    contentWidth,
  } = settings ?? {};

  /**
   * 2) BACKGROUND HANDLING
   * - full -> applied on outer section
   * - contained -> background only applied inside container
   */
  const sectionClass = `w-full${containerWidth === "full" && applyBackground ? "bg-theme" : ""}`;

  const containerClass = `
    mx-auto 
    w-full 
    max-w-7xl 
    py-12
    ${containerWidth === "contained" && applyBackground ? "bg-theme" : ""}
  `;

  /**
   * 3) GRID + CONTENT WIDTH
   * Grid always 12 cols, content spans based on width
   */
  const widthClass =
    contentWidth === "narrow"
      ? "col-span-6"
      : contentWidth === "wide"
        ? "col-span-10"
        : "col-span-12";

  /** contentWidth → span */
  const spanMap = {
    full: "col-span-12",
    wide: "col-span-10",
    narrow: "col-span-6",
  } as const;

  /** (width × placement) → col-start */
  const placementMap = {
    full: {
      left: "col-start-1",
      center: "col-start-1", // full is always full width
      right: "col-start-1",
    },
    wide: {
      left: "col-start-1",
      center: "col-start-2",
      right: "col-start-3",
    },
    narrow: {
      left: "col-start-1",
      center: "col-start-4",
      right: "col-start-7",
    },
  } as const;

  /** contentAlignment → text alignment */
  const textAlignMap = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  } as const;

  const gridClass = `grid grid-cols-12`;

  const contentClass = [
    spanMap[contentWidth ?? "full"], // col-span-X
    placementMap[contentWidth ?? "full"][blockPlacement ?? "left"], // col-start-X
    textAlignMap[contentAlignment ?? "left"],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      data-theme={[theme ?? "light"]}
      className={`${sectionClass} w-full `}
    >
      <div className="w-full px-4 md:px-6 lg:px-8 ">
        <div className={containerClass}>
          <div className={gridClass}>
            <div className={contentClass}>{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
