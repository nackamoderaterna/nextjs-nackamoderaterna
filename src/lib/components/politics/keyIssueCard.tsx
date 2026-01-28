import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface KeyIssueCardProps {
  title: string;
  relatedArea: string;
  slug: string;
}

export function KeyIssueCard({ title, relatedArea, slug }: KeyIssueCardProps) {
  return (
    <Link
      href={`politik/${slug}`}
      className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-all hover:border-brand-primary/50 hover:shadow-sm"
    >
      <p className="text-sm leading-relaxed text-foreground">{title}</p>
      <Badge
        variant="secondary"
        className="w-fit text-xs text-muted-foreground"
      >
        {relatedArea}
      </Badge>
    </Link>
  );
}
