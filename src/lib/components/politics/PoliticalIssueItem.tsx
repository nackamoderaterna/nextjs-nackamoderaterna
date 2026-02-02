import Link from "next/link";
import { CheckCircle2, Star } from "lucide-react";
import { ROUTE_BASE } from "@/lib/routes";
import { CategoryBadge } from "./CategoryBadge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/lib/components/ui/item";

interface AreaRef {
  _id?: string;
  name?: string | null;
  slug?: { current?: string } | null;
  icon?: { name?: string | null } | null;
}

interface PoliticalIssueItemProps {
  title: string;
  description?: string | null;
  politicalAreas?: AreaRef[];
  geographicalAreas?: AreaRef[];
  issueSlug?: string | null;
  fulfilled?: boolean;
  featured?: boolean;
}

export function PoliticalIssueItem({
  title,
  description,
  politicalAreas = [],
  geographicalAreas = [],
  issueSlug,
  fulfilled,
  featured,
}: PoliticalIssueItemProps) {
  const firstCategorySlug = politicalAreas[0]?.slug?.current ?? "";
  const href = issueSlug
    ? `${ROUTE_BASE.POLITICS_ISSUES}/${issueSlug}`
    : firstCategorySlug
      ? `${ROUTE_BASE.POLITICS_CATEGORY}/${firstCategorySlug}`
      : null;

  const politicalAreaItems = politicalAreas.filter((a) => a.name);
  const geographicalAreaItems = geographicalAreas.filter((a) => a.name);
  const hasBadges =
    politicalAreaItems.length > 0 || geographicalAreaItems.length > 0;

  const itemClassName = `h-full flex-col items-stretch rounded-lg ${
    fulfilled ? "hover:border-green-600/60" : "hover:border-brand-primary/50"
  }`;

  const content = (
    <>
      {fulfilled && (
        <ItemMedia variant="icon">
          <CheckCircle2
            className="size-5 text-green-600"
            aria-label="uppfyllt"
          />
        </ItemMedia>
      )}
      <ItemContent>
        <ItemHeader>
          <ItemTitle>{title}</ItemTitle>
          {featured && !fulfilled && (
            <Star
              className="size-3.5 shrink-0 text-brand-primary"
              aria-label="kärnfråga"
            />
          )}
        </ItemHeader>
        {description && <ItemDescription>{description}</ItemDescription>}
      </ItemContent>
      {hasBadges && (
        <ItemDescription>
          <span className="flex flex-wrap items-center gap-2">
            {[...politicalAreaItems]
              .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "sv"))
              .map((a) => (
                <CategoryBadge
                  key={a._id || a.name || ""}
                  name={a.name ?? ""}
                  icon={a.icon}
                />
              ))}
            {[...geographicalAreaItems]
              .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "sv"))
              .map((a) => (
                <CategoryBadge key={a._id || a.name || ""} name={a.name ?? ""} />
              ))}
          </span>
        </ItemDescription>
      )}
    </>
  );

  if (href) {
    return (
      <Item asChild variant="outline" className={itemClassName}>
        <Link href={href}>{content}</Link>
      </Item>
    );
  }

  return (
    <Item variant="outline" className={itemClassName}>
      {content}
    </Item>
  );
}
