import { groq } from "next-sanity";
import { MenuItem } from "~/sanity.types";
import menuItem from "~/sanity/schemas/objects/menuItem";
import { ROUTE_BASE } from "@/lib/routes";

export const navigationQuery = groq`*[_id == "navigationHeader"][0] {
  _id,
  title,
  customMenuItems[] {
    title,
    linkType,
    staticRoute,
    "internalLink": internalLink-> {
      ...,
      _type,
      "slug": slug.current,
      title,
      name
    },
    url,
    children[] {
      ...,
      staticRoute,
      "internalLink": internalLink-> {
        ...,
        _type,
        "slug": slug.current,
        title,
        name
      }
    }
  }
}`;

export const footerQuery = groq`*[_id == "navigationFooter"][0] {
  _id,
  columns[] {
    title,
    items[] {
      title,
      linkType,
      staticRoute,
      "internalLink": internalLink-> {
        ...,
        _type,
        "slug": slug.current,
        title,
        name
      },
      url
    }
  },
  footerText,
  legalText
}`;

export type MenuItemWithReference = Omit<
  MenuItem,
  "internalLink" | "children" | "staticRoute"
> & {
  internalLink?: {
    _type: string;
    slug: string;
    title?: string;
    name?: string;
  };
  /** Any route path (wider than Sanity menu options, e.g. /omrade) */
  staticRoute?: string;
  children?: MenuItemWithReference[];
  /** Icon for navigation items (e.g. political categories) */
  icon?: { name?: string | null } | null;
};

export interface NavigationData {
  _id: string;
  title: string;
  items: MenuItemWithReference[];
  customMenuItems?: MenuItemWithReference[];
}

// Helper to ensure href is valid (no $1 from regex replacement or bad CMS data)
function sanitizeHref(href: string): string {
  if (!href || href.includes("$1") || href.includes("/undefined") || href.includes("/null")) {
    return "#";
  }
  return href;
}

// Helper function to get the href for a menu item
export function getMenuItemHref(item: MenuItemWithReference): string {
  if (item.linkType === "external" && item.url) {
    return sanitizeHref(item.url);
  }

  if ((item.linkType as string) === "static" && item.staticRoute) {
    return sanitizeHref(item.staticRoute);
  }

  if (item.linkType === "internal" && item.internalLink) {
    const { _type, slug } = item.internalLink;
    if (!slug || slug === "$1") return "#";

    // Map content types to their routes
    const routeMap: Record<string, string> = {
      page: "",
      news: ROUTE_BASE.NEWS.slice(1),
      event: ROUTE_BASE.EVENTS.slice(1),
      politician: ROUTE_BASE.POLITICIANS.slice(1),
      politicalIssue: ROUTE_BASE.POLITICS_ISSUES.slice(1), // "politik/sakfragor"
    };

    const baseRoute = routeMap[_type] ?? _type;
    const href = baseRoute ? `/${baseRoute}/${slug}` : `/${slug}`;
    return sanitizeHref(href);
  }

  return "#";
}

export interface FooterColumn {
  title?: string;
  items: MenuItemWithReference[];
}

export interface FooterData {
  _id: string;
  columns?: FooterColumn[];
  footerText?: any[];
  legalText?: string;
}

// Query for geographical areas for navigation dropdown
export const navigationGeographicalAreasQuery = groq`*[_type == "geographicalArea"] | order(name asc) {
  _id,
  name,
  "slug": slug.current
}`;

// Query for political areas (categories) for navigation dropdown
export const navigationPoliticalAreasQuery = groq`*[_type == "politicalArea"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  icon{ name }
}`;

export interface NavigationAreaItem {
  _id: string;
  name: string;
  slug: string;
  icon?: { name?: string | null } | null;
}
