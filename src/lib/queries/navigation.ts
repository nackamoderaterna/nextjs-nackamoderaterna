import { groq } from "next-sanity";
import { MenuItem } from "~/sanity.types";
import menuItem from "~/sanity/schemas/objects/menuItem";

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
  socialLinks[] {
    platform,
    url
  },
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
      news: "nyheter",
      event: "event",
      politician: "politiker",
      politicalIssue: "fragor",
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
  socialLinks?: Array<{
    platform?: string;
    url?: string;
  }>;
  legalText?: string;
}
