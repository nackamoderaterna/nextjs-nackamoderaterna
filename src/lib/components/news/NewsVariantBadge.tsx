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
        variant === "debate" && "border-green-500/50 text-green-700 dark:text-green-400",
        variant === "pressrelease" && "border-blue-500/50 text-blue-700 dark:text-blue-400",
        className
      )}
    >
      {LABELS[variant]}
    </Badge>
  );
}
