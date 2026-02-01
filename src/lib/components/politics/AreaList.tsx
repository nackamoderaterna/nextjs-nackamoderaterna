import Link from "next/link";
import { Heart } from "lucide-react";
import { getLucideIcon } from "@/lib/utils/iconUtils";

export interface AreaListItem {
  _id?: string;
  name?: string | null;
  slug?: { current?: string } | null;
  icon?: { name?: string | null } | null;
}

interface AreaListProps {
  areas: AreaListItem[];
  getHref: (slug: string) => string;
}

export function AreaList({ areas, getHref }: AreaListProps) {
  if (!areas || areas.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {areas.map((area, index) => {
        if (!area.name) return null;
        const slug = area.slug?.current;
        const href = slug ? getHref(slug) : undefined;
        const Icon = area.icon?.name ? getLucideIcon(area.icon.name) : null;
        const AreaIcon = Icon ?? Heart;

        return (
          <div key={area._id ?? index}>
            {href ? (
              <Link
                href={href}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 -mx-2 -my-1.5 text-muted-foreground hover:text-foreground hover:bg-brand-primary/10 transition-colors"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-primary/10">
                  <AreaIcon className="h-4 w-4 text-brand-primary" />
                </span>
                {area.name}
              </Link>
            ) : (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-primary/10">
                  <AreaIcon className="h-4 w-4 text-brand-primary" />
                </span>
                {area.name}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
