import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

interface SectionProps {
  /** Optional section heading (e.g. "Aktuellt inom Nacka") */
  title?: ReactNode;
  /** Section body content */
  children: ReactNode;
  /** Optional actions shown next to the title (e.g. "Alla nyheter" link) */
  actions?: ReactNode;
  /** Extra class names for the section wrapper. Default includes mb-16. */
  className?: string;
  /** Title size: default (text-2xl) or large (text-3xl) for hero-style sections */
  titleSize?: "default" | "large";
  /** Optional id for anchor links (e.g. table of contents) */
  id?: string;
  /** Accessible label for the section when title is not descriptive enough */
  "aria-label"?: string;
}

const titleSizeClasses = {
  default: "text-2xl font-bold text-foreground",
  large: "text-3xl font-bold text-foreground",
};

export function Section({
  title,
  children,
  actions,
  className,
  titleSize = "default",
  id,
  "aria-label": ariaLabel,
}: SectionProps) {
  const titleClasses = titleSizeClasses[titleSize];

  return (
    <section
      id={id}
      className={cn("mb-16", className)}
      aria-label={ariaLabel}
    >

      {(title || actions) && (
        <div className="flex items-center justify-between mb-6 text-muted-foreground">
          {title && <h2 className={cn(titleClasses)}>{title}</h2>}
          
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
