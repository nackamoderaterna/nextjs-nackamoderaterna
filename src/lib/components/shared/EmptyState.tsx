import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <p
      className={cn(
        "text-muted-foreground text-center py-12",
        className
      )}
    >
      {message}
    </p>
  );
}
