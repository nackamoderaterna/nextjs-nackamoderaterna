"use client";

import { useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Renders a small hover-revealed link icon pointing to `#anchorId`.
 * Clicking it copies the full URL to the clipboard. Wrap the target in a "group" class.
 */
export function HeadingAnchorLink({
  anchorId,
  className,
}: {
  anchorId?: string | null;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  if (!anchorId) return null;

  async function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    const url = `${window.location.origin}${window.location.pathname}#${anchorId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.location.hash = anchorId!;
      return;
    }

    window.history.replaceState(null, "", `#${anchorId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <a
      href={`#${anchorId}`}
      onClick={handleClick}
      aria-label={copied ? "Länk kopierad" : "Kopiera länk till rubrik"}
      className={cn(
        "opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
    </a>
  );
}
