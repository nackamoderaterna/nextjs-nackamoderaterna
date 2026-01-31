import Link from "next/link";
import { Facebook, Instagram, Linkedin, Music2, Twitter } from "lucide-react";

/** Shape of social links from Sanity (socialLinks object type). */
export type SocialLinksData = {
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  tiktok?: string | null;
};

const PLATFORMS: Array<{
  key: keyof SocialLinksData;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: "facebook", label: "Facebook", Icon: Facebook },
  { key: "twitter", label: "Twitter / X", Icon: Twitter },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "tiktok", label: "TikTok", Icon: Music2 },
];

interface SocialLinksProps {
  /** Social links object from global settings or politician. */
  links?: SocialLinksData | null;
  /** Visual variant: compact (icon-only circles) or default (icon + label buttons). */
  variant?: "compact" | "default";
  /** Optional heading above the links. */
  heading?: string;
  className?: string;
}

export function SocialLinks({
  links,
  variant = "default",
  heading,
  className = "",
}: SocialLinksProps) {
  if (!links) return null;

  const entries = PLATFORMS.filter((p) => {
    const url = links[p.key];
    return typeof url === "string" && url.trim() !== "";
  });

  if (entries.length === 0) return null;

  return (
    <div className={className}>
      {heading && (
        <h3 className="font-semibold text-foreground mb-4">{heading}</h3>
      )}
      <div className={variant === "compact" ? "flex gap-3" : "flex flex-wrap gap-3"}>
        {entries.map(({ key, label, Icon }) => {
          const href = links[key]!;
          return (
            <Link
              key={key}
              href={href}
              className={
                variant === "compact"
                  ? "w-9 h-9 rounded bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                  : "inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              }
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {variant === "default" && <span>{label}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
