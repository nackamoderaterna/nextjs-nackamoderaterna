import Link from "next/link";
import { Badge } from "@/lib/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { ROUTE_BASE } from "@/lib/routes";

interface AreaRef {
  _id?: string;
  name?: string | null;
  slug?: { current?: string } | null;
}

interface KeyIssueCardProps {
  title: string;
  politicalAreas?: AreaRef[];
  geographicalAreas?: AreaRef[];
  /** @deprecated Use politicalAreas instead */
  relatedArea?: string;
  /** @deprecated Use first political area slug instead */
  slug?: string;
  issueSlug?: string | null;
  fulfilled?: boolean;
}

export function KeyIssueCard({
  title,
  politicalAreas = [],
  geographicalAreas = [],
  relatedArea,
  slug,
  issueSlug,
  fulfilled,
}: KeyIssueCardProps) {
  const firstCategorySlug =
    politicalAreas[0]?.slug?.current ?? slug ?? "";
  const href = issueSlug
    ? `${ROUTE_BASE.POLITICS_ISSUES}/${issueSlug}`
    : `${ROUTE_BASE.POLITICS_CATEGORY}/${firstCategorySlug}`;

  const cardClass = `group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-all hover:shadow-sm ${
    fulfilled ? "hover:border-green-600/60" : "hover:border-brand-primary/50"
  }`;

  const areaLabels = politicalAreas.length > 0
    ? politicalAreas.map((a) => a.name).filter(Boolean)
    : relatedArea
      ? [relatedArea]
      : [];
  const geoLabels = geographicalAreas.map((a) => a.name).filter(Boolean);
  const allLabels = [...areaLabels, ...geoLabels];

  return (
    <Link href={href} className={cardClass}>
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold leading-relaxed text-foreground">{title}</p>
        {fulfilled && (
          <CheckCircle2
            className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
            aria-label="uppfyllt"
          />
        )}
      </div>
      {allLabels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allLabels.map((label) => (
            <Badge
              key={label}
              variant="secondary"
              className="text-xs text-muted-foreground"
            >
              {label}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  );
}
