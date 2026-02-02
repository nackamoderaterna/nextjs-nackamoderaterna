import type { MenuItemWithReference } from "@/lib/queries/navigation";

/**
 * Builds the navigation structure from static items.
 * Previously injected Områden and Politik children; now returns static items as-is.
 */
export function buildNavigation(
  staticItems: MenuItemWithReference[]
): MenuItemWithReference[] {
  return structuredClone(staticItems);
}
