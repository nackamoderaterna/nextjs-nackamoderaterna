import { cn } from "@/lib/utils";
import React from "react";

export type BlockProps = {
  children: React.ReactNode;
  /**
   * Vertical padding size
   * @default "medium"
   */
  paddingY?: "none" | "small" | "medium" | "large" | "xlarge";
  /**
   * Horizontal padding size
   * @default "standard"
   */
  paddingX?: "none" | "standard";
  /**
   * Maximum width of the content container
   * @default "7xl"
   */
  maxWidth?: "none" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
  /**
   * Background color variant
   * @default "default"
   */
  background?: "default" | "muted" | "primary" | "transparent";
  /**
   * Whether to apply full-width styling (removes max-width constraint)
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Additional className for custom styling
   */
  className?: string;
  /**
   * Whether to render as a section element
   * @default true
   */
  asSection?: boolean;
};

const paddingYClasses = {
  none: "py-0",
  small: "py-8",
  medium: "py-12",
  large: "py-16 md:py-20",
  xlarge: "py-16 md:py-24",
};

const paddingXClasses = {
  none: "px-0",
  standard: "px-4 sm:px-6 lg:px-8",
};

const maxWidthClasses = {
  none: "",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
};

const backgroundClasses = {
  default: "",
  muted: "bg-muted/50",
  primary: "bg-primary text-primary-foreground",
  transparent: "bg-transparent",
};

/**
 * Standardized Block component for consistent spacing and layout across all block types
 * 
 * @example
 * ```tsx
 * <Block paddingY="large" maxWidth="6xl">
 *   <h2>Content</h2>
 * </Block>
 * ```
 */
export default function Block({
  children,
  paddingY = "medium",
  paddingX = "standard",
  maxWidth = "7xl",
  background = "default",
  fullWidth = false,
  className,
  asSection = true,
}: BlockProps) {
  const Component = asSection ? "section" : "div";

  return (
    <Component
      className={cn(
        "w-full",
        paddingYClasses[paddingY],
        backgroundClasses[background],
        className
      )}
    >
      <div
        className={cn(
          "w-full mx-auto",
          !fullWidth && maxWidthClasses[maxWidth],
          paddingXClasses[paddingX]
        )}
      >
        {children}
      </div>
    </Component>
  );
}
