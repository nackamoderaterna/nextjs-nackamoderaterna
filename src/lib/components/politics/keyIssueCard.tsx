import Link from "next/link";
import { Badge } from "@/lib/components/ui/badge";
import { CheckCircle2, CheckSquare } from "lucide-react";

interface KeyIssueCardProps {
  title: string;
  relatedArea: string;
  slug: string;
  fulfilled?: boolean;
}

export function KeyIssueCard({
  title,
  relatedArea,
  slug,
  fulfilled,
}: KeyIssueCardProps) {
  return (
    <Link
      href={`politik/${slug}`}
      className={`group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-all hover:shadow-sm ${
        fulfilled ? "hover:border-green-600/60" : "hover:border-brand-primary/50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm leading-relaxed text-foreground">{title}</p>
        {fulfilled && (
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" aria-label="uppfyllt" />
          
        )}
      </div>
      <Badge
        variant="secondary"
        className="w-fit text-xs text-muted-foreground"
      >
        {relatedArea}
      </Badge>
    </Link>
  );
}
