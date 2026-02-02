import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const paddingYClasses = {
  default: "py-12",
  compact: "py-8",
  top: "pt-12",
  none: "",
} as const;

interface PageContainerProps {
  children: ReactNode;
  /** Vertical padding: default (py-12), compact (py-8), top (pt-12), none */
  paddingY?: keyof typeof paddingYClasses;
  className?: string;
  as?: "main" | "div";
}

export function PageContainer({
  children,
  paddingY = "default",
  className,
  as: Component = "div",
}: PageContainerProps) {
  return (
    <Component
      className={cn(
        "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        paddingYClasses[paddingY],
        className
      )}
    >
      {children}
    </Component>
  );
}
