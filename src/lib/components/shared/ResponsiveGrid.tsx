import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const gapClasses = {
  default: "gap-4",
  large: "gap-6",
} as const;

const colsBaseClasses = {
  1: "grid-cols-1",
  2: "grid-cols-2",
} as const;

/** When colsBase=1: md:2 cols, lg:cols. When colsBase=2: lg:cols only. */
const colsResponsiveClasses: Record<
  2 | 3 | 4,
  { base1: string; base2: string }
> = {
  2: { base1: "md:grid-cols-2", base2: "lg:grid-cols-2" },
  3: { base1: "md:grid-cols-2 lg:grid-cols-3", base2: "lg:grid-cols-3" },
  4: { base1: "md:grid-cols-2 lg:grid-cols-4", base2: "lg:grid-cols-4" },
};

interface ResponsiveGridProps {
  children: ReactNode;
  /** Columns on lg breakpoint. Base: 1 col, md: 2 cols, lg: cols (when colsBase=1) */
  cols?: 2 | 3 | 4;
  /** Base columns on mobile (default 1). Use 2 for category-style grids (2→4 on lg). */
  colsBase?: 1 | 2;
  gap?: keyof typeof gapClasses;
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = 4,
  colsBase = 1,
  gap = "default",
  className,
}: ResponsiveGridProps) {
  const responsive = colsResponsiveClasses[cols][colsBase === 2 ? "base2" : "base1"];
  return (
    <div
      className={cn(
        "grid",
        colsBaseClasses[colsBase],
        responsive,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}
