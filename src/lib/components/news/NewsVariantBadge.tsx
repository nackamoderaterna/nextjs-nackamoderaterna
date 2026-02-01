import { Badge } from "@/lib/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NewsVariant } from "@/lib/types/news";

const LABELS: Record<Exclude<NewsVariant, "default">, string> = {
  debate: "Debattartikel",
  pressrelease: "Pressmeddelande",
};

interface NewsVariantBadgeProps {
  variant: Exclude<NewsVariant, "default">;
  className?: string;
}

export function NewsVariantBadge({ variant, className }: NewsVariantBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-sm font-medium",
        variant === "debate" && "border-green-500/50 text-green-700",
        variant === "pressrelease" &&
          "border-brand-primary/50 text-brand-primary",
        className
      )}
    >
      {LABELS[variant]}
    </Badge>
  );
}
