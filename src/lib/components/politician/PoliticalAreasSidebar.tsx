import { Heart } from "lucide-react";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import { ROUTE_BASE } from "@/lib/routes";
import { Sidebar } from "@/lib/components/shared/Sidebar";
import { SidebarList, SidebarListItem } from "@/lib/components/shared/SidebarList";

interface PoliticalArea {
  politicalArea?: {
    _id?: string;
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
  const areas = politicalAreas
    ?.filter((ref) => ref.politicalArea?.name)
    .map((ref) => ({
      _id: ref.politicalArea?._id,
      name: ref.politicalArea!.name!,
      slug: ref.politicalArea?.slug,
      icon: ref.politicalArea?.icon,
    }));

  if (!areas || areas.length === 0) {
    return null;
  }

  return (
    <Sidebar heading="Hjärtefrågor">
      <SidebarList>
        {areas.map((area, index) => {
          const Icon = area.icon?.name ? getLucideIcon(area.icon.name) : null;
          const AreaIcon = Icon ?? Heart;
          const slug = area.slug?.current;
          return (
            <SidebarListItem
              key={area._id ?? index}
              title={area.name}
              href={slug ? `${ROUTE_BASE.POLITICS_CATEGORY}/${slug}` : undefined}
              icon={<AreaIcon className="h-4 w-4 text-brand-primary" />}
            />
          );
        })}
      </SidebarList>
    </Sidebar>
  );
}
