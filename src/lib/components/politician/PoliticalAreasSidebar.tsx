import Link from "next/link";
import { IconHeart } from "@tabler/icons-react";
import { ROUTE_BASE } from "@/lib/routes";
import { Sidebar } from "@/lib/components/shared/Sidebar";
import { getLucideIcon } from "@/lib/utils/iconUtils";

interface PoliticalArea {
  politicalArea?: {
    name?: string;
    slug?: { current?: string };
    icon?: { name?: string | null } | null;
  };
}

interface PoliticalAreasSidebarProps {
  politicalAreas?: PoliticalArea[];
}

export function PoliticalAreasSidebar({
  politicalAreas,
}: PoliticalAreasSidebarProps) {
  if (!politicalAreas || politicalAreas.length === 0) {
    return null;
  }

  return (
    <Sidebar heading="Hjärtefrågor">
      <div className="space-y-2">
        {politicalAreas.map((areaRef, index) => {
          if (!areaRef.politicalArea?.name) return null;

          const href = areaRef.politicalArea.slug?.current
            ? `${ROUTE_BASE.POLITICS}/${areaRef.politicalArea.slug.current}`
            : undefined;

          const Icon =
            areaRef.politicalArea?.icon?.name
              ? getLucideIcon(areaRef.politicalArea.icon.name)
              : null;
          const AreaIcon = Icon ?? IconHeart;

          return (
            <div key={index}>
              {href ? (
                <Link
                  href={href}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 -mx-2 -my-1.5 text-muted-foreground hover:text-foreground hover:bg-brand-primary/10 transition-colors"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-primary/10">
                    <AreaIcon className="h-4 w-4 text-brand-primary" />
                  </span>
                  {areaRef.politicalArea.name}
                </Link>
              ) : (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-primary/10">
                    <AreaIcon className="h-4 w-4 text-brand-primary" />
                  </span>
                  {areaRef.politicalArea.name}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Sidebar>
  );
}
