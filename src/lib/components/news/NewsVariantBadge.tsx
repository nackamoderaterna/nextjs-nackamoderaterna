import Link from "next/link";
import { Badge } from "@/lib/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NewsVariant } from "@/lib/types/news";
import { ROUTE_BASE } from "@/lib/routes";

const LABELS: Record<Exclude<NewsVariant, "default">, string> = {
  debate: "Debattartikel",
  pressrelease: "Pressmeddelande",
};

interface NewsVariantBadgeProps {
  variant: Exclude<NewsVariant, "default">;
  className?: string;
  /** When true, badge links to the news listing filtered by this variant (default: true) */
  linkToFilter?: boolean;
}

export function NewsVariantBadge({
  variant,
  className,
  linkToFilter = true,
}: NewsVariantBadgeProps) {
  const badge = (
    <Badge
      variant="outline"
      className={cn(
        "text-sm font-medium",
        linkToFilter && "transition-colors hover:opacity-90",
        variant === "debate" && "border-green-500/50 text-green-700",
        variant === "pressrelease" &&
          "border-brand-primary/50 text-brand-primary",
        className
      )}
    >
      {LABELS[variant]}
    </Badge>
  );

  if (linkToFilter) {
    return (
      <Link
        href={`${ROUTE_BASE.NEWS}?type=${variant}`}
        className="inline-block"
        aria-label={`Visa ${LABELS[variant]}`}
      >
        {badge}
      </Link>
    );
  }

  return badge;
}
