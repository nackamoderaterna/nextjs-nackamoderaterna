// utils/mediaBlock.ts

import {
  CONTAINER_MAX_WIDTH,
  CONTAINER_PADDING,
  TEXT_COLUMN_MAX_WIDTH,
} from "./layout";

export type ImageWidth = "full" | "contained" | "inline";
export type ImageAlignment = "left" | "center" | "right";
export type VideoType = "youtube" | "vimeo" | "direct";

interface VideoInfo {
  type: VideoType;
  id: string;
}

const widthClasses: Record<ImageWidth, string> = {
  full: "w-full",
  contained: CONTAINER_MAX_WIDTH,
  inline: TEXT_COLUMN_MAX_WIDTH,
};

const alignmentClasses: Record<ImageAlignment, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export class ImageBlockUtils {
  static getWidthClass(width: ImageWidth): string {
    return widthClasses[width];
  }

  static getAlignmentClass(alignment: ImageAlignment): string {
    return alignmentClasses[alignment];
  }

  static getBlockContainerClasses(width: ImageWidth): string {
    return `w-full flex justify-center my-8 ${this.isFullWidth(width) ? "" : "px-4"}`;
  }

  static getImageClasses(width: ImageWidth): string {
    return `${width === "full" ? "" : "rounded"} relative overflow-hidden bg-gray-100`;
  }
  static getContentConstraintClasses(
    alignment: ImageAlignment,
    width: ImageWidth,
  ) {
    return `${this.isFullWidth(width) ? "w-full" : CONTAINER_MAX_WIDTH} w-full flex ${this.getAlignmentClass(alignment)}`;
  }

  static getImageContainerClasses(width: ImageWidth): string {
    return `${this.getWidthClass(width)} w-full flex flex-col items-center`;
  }

  static getImageSizes(width: ImageWidth): string {
    const sizeMap: Record<ImageWidth, string> = {
      full: "100vw",
      contained: "(max-width: 768px) 100vw, 1280px",
      inline: "(max-width: 768px) 100vw, 896px",
    };

    return sizeMap[width];
  }

  static isFullWidth(width: ImageWidth): boolean {
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
