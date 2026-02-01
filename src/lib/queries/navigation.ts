import { groq } from "next-sanity";
import { MenuItem } from "~/sanity.types";
import menuItem from "~/sanity/schemas/objects/menuItem";
import { ROUTE_BASE } from "@/lib/routes";

export const navigationQuery = groq`*[_id == "navigationHeader"][0] {
  _id,
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
  "internalLink" | "children"
> & {
  internalLink?: {
    _type: string;
    slug: string;
    title?: string;
    name?: string;
  };
  staticRoute?: string;
  children?: MenuItemWithReference[];
};

export interface NavigationData {
  _id: string;
  title: string;
  items: MenuItemWithReference[];
}

// Helper function to get the href for a menu item
export function getMenuItemHref(item: MenuItemWithReference): string {
  if (item.linkType === "external" && item.url) {
    return item.url;
  }

  if ((item.linkType as string) === "static" && item.staticRoute) {
    return item.staticRoute;
  }

  if (item.linkType === "internal" && item.internalLink) {
    const { _type, slug } = item.internalLink;

    // Map content types to their routes
    const routeMap: Record<string, string> = {
      page: "",
      news: ROUTE_BASE.NEWS.slice(1),
      event: ROUTE_BASE.EVENTS.slice(1),
      politician: ROUTE_BASE.POLITICIANS.slice(1),
      politicalIssue: ROUTE_BASE.POLITICS_ISSUES.slice(1), // "politik/sakfragor"
    };

    const baseRoute = routeMap[_type] ?? _type;
    return baseRoute ? `/${baseRoute}/${slug}` : `/${slug}`;
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
