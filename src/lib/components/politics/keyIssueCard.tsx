import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { ROUTE_BASE } from "@/lib/routes";
import { CategoryBadge } from "./CategoryBadge";

interface AreaRef {
  _id?: string;
  name?: string | null;
  slug?: { current?: string } | null;
  icon?: { name?: string | null } | null;
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

  const politicalAreaItems = politicalAreas.length > 0
    ? politicalAreas.filter((a) => a.name)
    : relatedArea
      ? [{ _id: "legacy", name: relatedArea, slug: { current: firstCategorySlug } }]
      : [];
  const geographicalAreaItems = geographicalAreas.filter((a) => a.name);

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
      {(politicalAreaItems.length > 0 || geographicalAreaItems.length > 0) && (
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {[...politicalAreaItems]
            .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
            .map((a) => (
              <span key={a._id || a.name || ""} className="flex-none w-fit">
                <CategoryBadge name={a.name ?? ""} icon={a.icon} />
              </span>
            ))}
          {geographicalAreaItems
            .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
            .map((a) => (
              <span key={a._id || a.name || ""} className="flex-none w-fit">
                <CategoryBadge name={a.name ?? ""} />
              </span>
            ))}
        </div>
      )}
    </Link>
  );
}
