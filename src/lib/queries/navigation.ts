import { groq } from "next-sanity";
import { MenuItem } from "~/sanity.types";
import menuItem from "~/sanity/schemas/objects/menuItem";

export const navigationQuery = groq`*[_type == "navigationHeader"][0] {
  _id,
  title,
  items[] {
    title,
    linkType,
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

export type MenuItemWithReference = Omit<
  MenuItem,
  "internalLink" | "children"
> & {
  internalLink: {
    _type: string;
    slug: string;
    title?: string;
    name?: string;
  };
  children: MenuItemWithReference[];
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

  if (item.linkType === "internal" && item.internalLink) {
    const { _type, slug } = item.internalLink;

    // Map content types to their routes
    const routeMap: Record<string, string> = {
      page: "",
      news: "nyheter",
      event: "evenemang",
      politician: "politiker",
      politicalIssue: "fragor",
    };

    const baseRoute = routeMap[_type] || _type;
    return baseRoute ? `/${baseRoute}/${slug}` : `/${slug}`;
  }

  return "#";
}
