import { cn } from "@/lib/utils";

/** Block heading object from Sanity */
export type BlockHeadingData = {
  title?: string | null;
  subtitle?: string | null;
};

/** Extract title and subtitle from block heading, with legacy flat field support */
export function getBlockHeading(block: {
  heading?: BlockHeadingData | string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
}): { title?: string | null; subtitle?: string | null } {
  const h = block.heading;
  if (typeof h === "object" && h !== null) {
    return { title: h.title ?? null, subtitle: h.subtitle ?? null };
  }
  if (typeof h === "string") {
    return { title: h || null, subtitle: block.description ?? null };
  }
  return {
    title: block.title ?? null,
    subtitle: block.subtitle ?? block.description ?? null,
  };
}

export interface BlockHeadingProps {
  /** Title (main heading) */
  title?: string | null;
  /** Subtitle (description/underheading) */
  subtitle?: string | null;
  /** Additional className for the wrapper */
  className?: string;
  /** Whether to center the heading (default: true for most blocks) */
  centered?: boolean;
  /** Max width for subtitle text (default: max-w-2xl) */
  subtitleMaxWidth?: "none" | "xl" | "2xl";
}

/**
 * Renders a block heading with title and optional subtitle.
 * Supports both new blockHeading object and legacy flat heading/description.
 */
export function BlockHeading({
  title,
  subtitle,
  className,
  centered = true,
  subtitleMaxWidth = "2xl",
}: BlockHeadingProps) {
  if (!title && !subtitle) return null;

  const maxWidthClasses = {
    none: "",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div
      className={cn(
        "mb-4 md:mb-6",
        centered && "text-center",
        className
      )}
    >
      {title && (
        <h2 className="mb-2 md:mb-3 text-2xl font-bold md:text-3xl">{title}</h2>
      )}
      {subtitle && (
        <p
          className={cn(
            "text-lg text-muted-foreground",
            centered && "mx-auto",
            maxWidthClasses[subtitleMaxWidth]
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
