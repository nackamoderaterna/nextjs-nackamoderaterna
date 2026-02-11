import { groq } from "next-sanity";
import { ROUTE_BASE } from "@/lib/routes";
import type { SearchItem } from "@/lib/components/search/SearchBar";

export const searchQuery = groq`
{
  "politicians": *[_type == "politician"] {
    _id,
    _type,
    name,
    slug,
    email,
    image{ ..., hotspot, crop },
    "searchText": coalesce(name, "") + " " + coalesce(email, "")
  },
  "events": *[_type == "event"] {
    _id,
    _type,
    title,
    slug,
    startDate,
    endDate,
    location,
    description,
    image{ ..., hotspot, crop },
    "searchText": coalesce(title, "") + " " + coalesce(location, "") + " " + coalesce(description, "")
  },
  "news": *[_type == "news"] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    mainImage{ ..., hotspot, crop },
    "searchText": coalesce(title, "") + " " + coalesce(excerpt, "")
  },
  "politicalAreas": *[_type == "politicalArea"] {
    _id,
    _type,
    name,
    slug,
    description,
    icon{ name },
    "searchText": coalesce(name, "") + " " + coalesce(description, "")
  },
  "geographicalAreas": *[_type == "geographicalArea"] {
    _id,
    _type,
    name,
    slug,
    description,
    image{ ..., hotspot, crop },
    "searchText": coalesce(name, "") + " " + coalesce(description, "")
  },
  "politicalIssues": *[_type == "politicalIssue"] {
    _id,
    _type,
    question,
    slug,
    description,
    featured,
    fulfilled,
    "searchText": coalesce(question, "") + " " + coalesce(description, "")
  }
}
`;

export interface SearchData {
  politicians: Array<{ _id: string; name?: string; slug?: { current: string }; searchText?: string; image?: any }>;
  events: Array<{ _id: string; title?: string; slug?: { current: string }; description?: string; searchText?: string; image?: any }>;
  news: Array<{ _id: string; title?: string; slug?: { current: string }; excerpt?: string; searchText?: string; mainImage?: any }>;
  politicalAreas: Array<{ _id: string; name?: string; slug?: { current: string }; searchText?: string; icon?: { name?: string | null } | null }>;
  geographicalAreas: Array<{ _id: string; name?: string; slug?: { current: string }; searchText?: string; image?: any }>;
  politicalIssues: Array<{ _id: string; question?: string; slug?: { current: string }; description?: string; featured?: boolean; fulfilled?: boolean; searchText?: string }>;
}

function toStringOrUndefined(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function buildSearchItems(data: SearchData): SearchItem[] {
  const items: SearchItem[] = [];

  data.politicians.forEach((item) => {
    items.push({
      _id: item._id,
      name: item.name || "",
      category: "Politiker",
      url: `${ROUTE_BASE.POLITICIANS}/${item.slug?.current || ""}`,
      searchText: item.searchText,
      image: item.image,
    });
  });

  data.events.forEach((item) => {
    items.push({
      _id: item._id,
      name: item.title || "",
      description: toStringOrUndefined(item.description),
      category: "Evenemang",
      url: `${ROUTE_BASE.EVENTS}/${item.slug?.current || ""}`,
      searchText: item.searchText,
      image: item.image,
    });
  });

  data.news.forEach((item) => {
    items.push({
      _id: item._id,
      name: item.title || "",
      description: toStringOrUndefined(item.excerpt),
      category: "Nyheter",
      url: `${ROUTE_BASE.NEWS}/${item.slug?.current || ""}`,
      searchText: item.searchText,
      image: item.mainImage,
    });
  });

  data.politicalAreas.forEach((item) => {
    items.push({
      _id: item._id,
      name: item.name || "",
      category: "Politiskt område",
      url: `${ROUTE_BASE.POLITICS_CATEGORY}/${item.slug?.current || ""}`,
      searchText: item.searchText,
      iconName: item.icon?.name,
    });
  });

  data.geographicalAreas.forEach((item) => {
    items.push({
      _id: item._id,
      name: item.name || "",
      category: "Geografiskt område",
      url: `${ROUTE_BASE.AREAS}/${item.slug?.current || ""}`,
      searchText: item.searchText,
      image: item.image,
    });
  });

  data.politicalIssues.forEach((item) => {
    items.push({
      _id: item._id,
      name: item.question || "",
      description: toStringOrUndefined(item.description),
      category: "Sakfråga",
      url: `${ROUTE_BASE.POLITICS_ISSUES}/${item.slug?.current || ""}`,
      searchText: item.searchText,
    });
  });

  return items;
}
