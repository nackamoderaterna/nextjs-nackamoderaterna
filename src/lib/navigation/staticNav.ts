import type { MenuItemWithReference } from "@/lib/queries/navigation";
import { ROUTE_BASE } from "@/lib/routes";

/**
 * Static navigation items shown in the header before any CMS-configured items.
 * Use linkType "static" and staticRoute so getMenuItemHref resolves them correctly.
 */
export const staticNavItems: MenuItemWithReference[] = [
  {
    _type: "menuItem",
    title: "Politik",
    linkType: "static",
    staticRoute: ROUTE_BASE.POLITICS,
  },
  {
    _type: "menuItem",
    title: "Sakfrågor",
    linkType: "static",
    staticRoute: ROUTE_BASE.POLITICS_ISSUES,
  },
  {
    _type: "menuItem",
    title: "Politiker",
    linkType: "static",
    staticRoute: ROUTE_BASE.POLITICIANS,
  },
  {
    _type: "menuItem",
    title: "Nyheter",
    linkType: "static",
    staticRoute: ROUTE_BASE.NEWS,
  },
  {
    _type: "menuItem",
    title: "Evenemang",
    linkType: "static",
    staticRoute: ROUTE_BASE.EVENTS,
  },
  {
    _type: "menuItem",
    title: "Kontakt",
    linkType: "static",
    staticRoute: "/kontakt",
  },
];
