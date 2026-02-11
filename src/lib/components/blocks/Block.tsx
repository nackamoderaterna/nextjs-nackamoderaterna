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
   * Background color variant
   * @default "default"
   */
  background?: "default" | "muted" | "primary" | "transparent";
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
  small: "py-4 md:py-6",
  medium: "py-6 md:py-10",
  large: "py-8 md:py-14",
  xlarge: "py-10 md:py-16",
};

const backgroundClasses = {
  default: "",
  muted: "bg-muted/50",
  primary: "bg-primary text-primary-foreground",
  transparent: "bg-transparent",
};

/**
 * Lightweight semantic/styling wrapper for page blocks.
 * Layout (padding-x, max-width, spacing) is controlled by PageBuilder.
 */
export default function Block({
  children,
  paddingY = "medium",
  background = "default",
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
      {children}
    </Component>
  );
}
