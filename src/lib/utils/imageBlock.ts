import { ContainerWidth, ContentWidth } from "@/app/shared/layout/container";

export type AspectRatio = "16/9" | "4/3" | "1/1" | "9/16" | "auto";

export const aspectRatioMap: Record<AspectRatio, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-4/3",
  "1/1": "aspect-square",
  "9/16": "aspect-9/16",
  auto: "",
};
export const imageSizeMap: Record<ContentWidth, string> = {
  full: "100vw",
  wide: "(max-width: 768px) 100vw, 1280px",
  narrow: "(max-width: 768px) 100vw, 896px",
};

export class ImageBlockUtils {
  static getBlockContainerClasses(width: ContentWidth): string {
    return `w-full flex justify-center my-8 ${this.isFullWidth(width) ? "" : "px-4"}`;
  }

  static getImageClasses(width: ContentWidth): string {
    return `${width === "full" ? "" : "rounded"} relative overflow-hidden bg-gray-100`;
  }

  static getImageSizes(width: ContentWidth): string {
    const sizeMap: Record<ContentWidth, string> = {
      full: "100vw",
      wide: "(max-width: 768px) 100vw, 1280px",
      narrow: "(max-width: 768px) 100vw, 896px",
    };

    return sizeMap[width];
  }

  static isFullWidth(width: ContentWidth): boolean {
    return width === "full";
  }

  static shouldUseFillLayout(aspectRatio: string): boolean {
    return aspectRatio !== "auto";
  }

  static getImageDimensions(aspectRatio: string): {
    width?: number;
    height?: number;
  } {
    if (aspectRatio === "auto") {
      return { width: 1200, height: 800 };
    }
    return {};
  }

  static getImageClassName(aspectRatio: string): string {
    return this.shouldUseFillLayout(aspectRatio)
      ? "object-cover"
      : "w-full h-auto";
  }
}
