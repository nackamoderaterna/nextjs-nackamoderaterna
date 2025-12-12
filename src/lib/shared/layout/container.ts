export type ContainerWidth = "full" | "contained";
export type ContentAlignment = "left" | "center" | "right";
export type ContentWidth = "narrow" | "wide" | "full";
export type ContainerAlignment = "left" | "center" | "right";

export const containerWidthMap: Record<ContainerWidth, string> = {
  full: "w-full mx-auto",
  contained: "max-w-6xl mx-auto",
};

export interface GridAlignmentProps {
  width: ContentWidth;
  containerAlignment: ContainerAlignment;
}

export const getGridAlignment = ({
  width,
  containerAlignment,
}: GridAlignmentProps) => {
  // Map each combination to complete Tailwind class strings
  const classMap: Record<string, string> = {
    "narrow-left": "col-span-12 md:col-start-1 md:col-span-4",
    "narrow-center": "col-span-12 md:col-start-5 md:col-span-4",
    "narrow-right": "col-span-12 md:col-start-9 md:col-span-4",
    "wide-left": "col-span-12 md:col-start-1 md:col-span-8",
    "wide-center": "col-span-12 md:col-start-3 md:col-span-8",
    "wide-right": "col-span-12 md:col-start-5 md:col-span-8",
    "full-left": "col-span-12",
    "full-center": "col-span-12",
    "full-right": "col-span-12",
  };

  const key = `${width}-${containerAlignment}`;
  return classMap[key] || "col-span-12";
};
export const contentAlignmentMap: Record<ContentAlignment, string> = {
  left: "text-left justify-self-end",
  center: "text-center justify-self-center",
  right: "text-right justify-self-end",
};
