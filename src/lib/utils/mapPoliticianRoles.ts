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
        positionTitles[
          politician.partyBoard.position as keyof typeof positionTitles
        ],
    });
  }

  if (politician.kommunfullmaktige?.active) {
    roles.push({
      title: "Kommunfullmäktige",
      description:
        positionTitles[
          politician.kommunfullmaktige.role as keyof typeof positionTitles
        ],
    });
  }

  if (politician.namndPositions?.length > 0) {
    politician.namndPositions.forEach((pos: any) => {
      roles.push({
        title: pos.namnd.title,
        description:
          positionTitles[pos.position as keyof typeof positionTitles] ||
          pos.position,
      });
    });
  }

  return roles;
}
