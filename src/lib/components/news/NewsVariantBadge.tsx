import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NewsVariant = "debate" | "pressrelease";

const LABELS: Record<NewsVariant, string> = {
  debate: "Debattartikel",
  pressrelease: "Pressmeddelande",
};

interface NewsVariantBadgeProps {
  variant: NewsVariant;
  className?: string;
}

export function NewsVariantBadge({ variant, className }: NewsVariantBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium",
        variant === "debate" && "border-green-500/50 text-green-700",
        variant === "pressrelease" && "border-brand-primary/10 text-brand-primary",
        className
      )}
    >
      {LABELS[variant]}
    </Badge>
  );
}
