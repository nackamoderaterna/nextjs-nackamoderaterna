export type AspectRatio = "16/9" | "4/3" | "1/1" | "9/16" | "auto";

export const aspectRatioMap: Record<AspectRatio, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-4/3",
  "1/1": "aspect-square",
  "9/16": "aspect-9/16",
  auto: "",
};
