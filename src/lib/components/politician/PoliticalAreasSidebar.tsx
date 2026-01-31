import Link from "next/link";
import { IconHeart } from "@tabler/icons-react";
import { ROUTE_BASE } from "@/lib/routes";
import { Sidebar } from "@/lib/components/shared/Sidebar";

interface PoliticalArea {
  politicalArea?: {
    name?: string;
    slug?: {
      current?: string;
    };
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

          return (
            <div key={index}>
              {href ? (
                <Link
                  href={href}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <IconHeart className="h-4 w-4 shrink-0 text-primary/70" />
                  {areaRef.politicalArea.name}
                </Link>
              ) : (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconHeart className="h-4 w-4 shrink-0 text-primary/70" />
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
