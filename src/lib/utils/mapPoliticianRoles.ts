import { Role } from "../components/politician/roleSidebar";
import { positionTitles } from "../politicians";

interface MapRolesArgs {
  politician: any;
}

export function mapPoliticianRoles({ politician }: MapRolesArgs): Role[] {
  const roles: Role[] = [];

  if (politician.kommunalrad?.active) {
    roles.push({
      title: "Kommunalråd",
      description:
        politician.kommunalrad.role === "president"
          ? "Kommunstyrelsens ordförande"
          : "Kommunalråd",
    });
  }

  if (politician.partyBoard?.active) {
    roles.push({
      title: "Styrelseuppdrag",
      description:
        politician.partyBoard.title ||
        (politician.partyBoard.isLeader ? "Ordförande" : "Ledamot"),
    });
  }

  if (politician.kommunfullmaktige?.active) {
    const desc =
      politician.kommunfullmaktige.title ||
      positionTitles[
        politician.kommunfullmaktige.role as keyof typeof positionTitles
      ];
    roles.push({
      title: "Kommunfullmäktige",
      description: desc,
    });
  }

  if (politician.namndPositions?.length > 0) {
    politician.namndPositions.forEach((pos: any) => {
      roles.push({
        title: pos.namnd.title,
        description: pos.title || "Ledamot",
      });
    });
  }

  // Add political areas (hjärtefrågor)
  if (politician.politicalAreas?.length > 0) {
    politician.politicalAreas.forEach((areaRef: any) => {
      if (areaRef.politicalArea?.name) {
        roles.push({
          title: "Hjärtefråga",
          description: areaRef.politicalArea.name,
          href: areaRef.politicalArea.slug?.current
            ? `/politik/${areaRef.politicalArea.slug.current}`
            : undefined,
        });
      }
    });
  }

  return roles;
}
