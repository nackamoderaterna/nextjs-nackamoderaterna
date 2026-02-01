import { getLucideIcon } from "@/lib/utils/iconUtils";
import { cn } from "@/lib/utils";

type CategoryBadgeSize = "sm" | "default";
type CategoryBadgeVariant = "muted" | "brand";

interface CategoryBadgeProps {
  name: string;
  icon?: { name?: string | null } | null;
  size?: CategoryBadgeSize;
  variant?: CategoryBadgeVariant;
}

const sizeClasses: Record<CategoryBadgeSize, string> = {
  sm: "gap-1 px-2 py-0.5 text-xs [&_svg]:size-3",
  default: "gap-2 px-3 py-1.5 text-xs [&_svg]:size-4",
};

const variantClasses: Record<CategoryBadgeVariant, string> = {
  muted: "text-muted-foreground bg-muted/60",
  brand:
    "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors",
};

export function CategoryBadge({
  name,
  icon,
  size = "sm",
  variant = "muted",
}: CategoryBadgeProps) {
  const Icon = icon?.name ? getLucideIcon(icon.name) : null;

  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-full capitalize tracking-wider",
        sizeClasses[size],
        variantClasses[variant]
      )}
    >
      {Icon && <Icon className="shrink-0" />}
      <span>{name}</span>
    </span>
  );
}
