import { ROUTE_BASE } from "@/lib/routes";
import { Sidebar } from "@/lib/components/shared/Sidebar";
import { AreaList } from "@/lib/components/politics/AreaList";

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
      <AreaList
        areas={areas}
        getHref={(slug) => `${ROUTE_BASE.POLITICS_CATEGORY}/${slug}`}
      />
    </Sidebar>
  );
}
