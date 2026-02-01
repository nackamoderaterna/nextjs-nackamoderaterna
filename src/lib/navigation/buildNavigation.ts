import type {
  MenuItemWithReference,
  NavigationAreaItem,
} from "@/lib/queries/navigation";
import { ROUTE_BASE } from "@/lib/routes";

/**
 * Builds the complete navigation structure by injecting dynamic data from Sanity
 * into the static navigation structure.
 *
 * - Adds "Områden" as a top-level dropdown with geographical areas
 * - Injects political areas (categories) under Politik > Kategori
 */
export function buildNavigation(
  staticItems: MenuItemWithReference[],
  geographicalAreas: NavigationAreaItem[],
  politicalAreas: NavigationAreaItem[]
): MenuItemWithReference[] {
  // Deep clone to avoid mutating the original
  const items = structuredClone(staticItems);

  // Create the Områden dropdown with geographical areas as children
  const validGeographicalAreas = geographicalAreas.filter(
    (a) => a.slug && a.slug !== "$1"
  );
  const omradenItem: MenuItemWithReference = {
    _type: "menuItem",
    title: "Områden",
    linkType: "static",
    staticRoute: ROUTE_BASE.POLITICS_AREA,
    children: validGeographicalAreas.map((area) => ({
      _type: "menuItem",
      title: area.name,
      linkType: "static",
      staticRoute: `${ROUTE_BASE.POLITICS_AREA}/${area.slug}`,
    })) as unknown as MenuItemWithReference[],
  };

  // Find Politik item and inject political areas under Kategori
  const politikIndex = items.findIndex((item) => item.title === "Politik");
  if (politikIndex !== -1 && items[politikIndex].children) {
    const kategoriIndex = items[politikIndex].children!.findIndex(
      (child) => child.title === "Kategori"
    );
    if (kategoriIndex !== -1) {
      const validPoliticalAreas = politicalAreas.filter(
        (a) => a.slug && a.slug !== "$1"
      );
      items[politikIndex].children![kategoriIndex] = {
        ...items[politikIndex].children![kategoriIndex],
        children: validPoliticalAreas.map((area) => ({
          _type: "menuItem",
          title: area.name,
          linkType: "static",
          staticRoute: `${ROUTE_BASE.POLITICS_CATEGORY}/${area.slug}`,
          icon: area.icon,
        })) as unknown as MenuItemWithReference[],
      };
    }
  }

  // Insert Områden after Politik (index 0 is Politik based on current structure)
  // Find Politik index and insert after it
  const insertIndex = politikIndex !== -1 ? politikIndex + 1 : 1;
  items.splice(insertIndex, 0, omradenItem);

  return items;
}
