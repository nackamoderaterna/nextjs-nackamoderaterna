import { Link as LinkIcon } from "lucide-react";
import { stegaClean } from "next-sanity";
import { cn } from "@/lib/utils";

/** Block heading object from Sanity */
export type BlockHeadingData = {
  title?: string | null;
  subtitle?: string | null;
  anchorId?: { current?: string | null } | null;
};

/** Extract title, subtitle and anchor id from block heading, with legacy flat field support */
export function getBlockHeading(block: {
  heading?: BlockHeadingData | string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
}): { title?: string | null; subtitle?: string | null; anchorId?: string | null } {
  const h = block.heading;
  if (typeof h === "object" && h !== null) {
    return {
      title: h.title ?? null,
      subtitle: h.subtitle ?? null,
      // Strip Visual Editing stega encoding: harmless in visible text, but it
      // pollutes anchor ids/hrefs with invisible unicode when used as such.
      anchorId: stegaClean(h.anchorId?.current) ?? null,
    };
  }
  if (typeof h === "string") {
    return { title: h || null, subtitle: block.description ?? null };
  }
  return {
    title: block.title ?? null,
    subtitle: block.subtitle ?? block.description ?? null,
  };
}

/** Renders a small hover-revealed link icon pointing to `#anchorId`. Wrap the target in a "group" class. */
export function HeadingAnchorLink({
  anchorId,
  className,
}: {
  anchorId?: string | null;
  className?: string;
}) {
  if (!anchorId) return null;

  return (
    <a
      href={`#${anchorId}`}
      aria-label="Länk till rubrik"
      className={cn(
        "opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <LinkIcon className="h-4 w-4" />
    </a>
  );
}

export interface BlockHeadingProps {
  /** Title (main heading) */
  title?: string | null;
  /** Subtitle (description/underheading) */
  subtitle?: string | null;
  /** Anchor id, makes the title linkable via #anchorId */
  anchorId?: string | null;
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
  anchorId,
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
        <h2
          id={anchorId ?? undefined}
          className={cn(
            "mb-2 md:mb-3 text-2xl font-bold md:text-3xl scroll-mt-24",
            anchorId && "group inline-flex items-center gap-2"
          )}
        >
          {title}
          <HeadingAnchorLink anchorId={anchorId} />
        </h2>
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
