import Link from "next/link";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { ROUTE_BASE } from "@/lib/routes";
import { cleanInvisibleUnicode } from "@/lib/politicians";
import { cn } from "@/lib/utils";

export interface PersonListLinkProps {
  slug: string;
  image?: unknown;
  name?: string | null;
  /** Optional role or title (e.g. "Kommunalråd") */
  title?: string | null;
  className?: string;
}

/**
 * Compact single-row link for listing a person in sidebars or lists.
 * Designed to fit narrow widths with truncation; no border, minimal padding.
 */
export function PersonListLink({
  slug,
  image,
  name,
  title,
  className,
}: PersonListLinkProps) {
  const href = `${ROUTE_BASE.POLITICIANS}/${slug}`.replace(/\/+/g, "/");
  const displayName = cleanInvisibleUnicode(name?.trim() || "Namn saknas");
  const displayTitle = title?.trim()
    ? cleanInvisibleUnicode(title.trim())
    : null;

  return (
    <Link
      href={href}
      scroll
      className={cn(
        "flex items-center gap-2 rounded-md p-2 -m-2 min-w-0 w-full",
        "text-left transition-colors hover:bg-muted",
        className
      )}
    >
      <span className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
        {image ? (
          <SanityImage
            image={image}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="size-full bg-muted" />
        )}
      </span>
      <span className="min-w-0 flex-1 overflow-hidden">
        <span className="block truncate text-sm font-medium text-foreground">
          {displayName}
        </span>
        {displayTitle && (
          <span className="block truncate text-xs text-muted-foreground">
            {displayTitle}
          </span>
        )}
      </span>
    </Link>
  );
}
