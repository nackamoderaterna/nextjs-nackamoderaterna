import Link from "next/link";
import { MainNav } from "../navigation/MainNav";
import { MobileNav } from "../navigation/MobileNav";
import { SearchBar, SearchItem } from "../search/SearchBar";
import { Button } from "@/lib/components/ui/button";
import { sanityClient } from "@/lib/sanity/client";
import {
  navigationQuery,
  NavigationData,
  MenuItemWithReference,
} from "@/lib/queries/navigation";
import { staticNavItems } from "@/lib/navigation/staticNav";
import { buildNavigation } from "@/lib/navigation/buildNavigation";
import {
  globalSettingsQuery,
  GlobalSettingsData,
} from "@/lib/queries/globalSettings";
import { searchQuery } from "@/lib/queries/search";
import { SanityImage } from "./SanityImage";
import { ROUTE_BASE } from "@/lib/routes";
import { Heart } from "lucide-react";

interface SearchData {
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

function buildSearchItems(data: SearchData): SearchItem[] {
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

export default async function Header() {
  const [navigation, globalSettings, searchData] = await Promise.all([
    sanityClient.fetch<NavigationData>(navigationQuery),
    sanityClient.fetch<GlobalSettingsData>(globalSettingsQuery),
    sanityClient.fetch<SearchData>(searchQuery),
  ]);

  const searchItems = buildSearchItems(searchData);

  const companyName = globalSettings?.companyName || "Nackamoderaterna";
  const logo = globalSettings?.logo;
  const bliMedlemUrl = globalSettings?.bliMedlemUrl;

  // Use CMS-configured navigation if available, otherwise fall back to static items
  let navItems: MenuItemWithReference[];

  if (
    globalSettings?.mainNavigation &&
    globalSettings.mainNavigation.length > 0
  ) {
    // Use mainNavigation directly - it's already in MenuItemWithReference format
    navItems = globalSettings.mainNavigation.filter((item) => !!item.title);
  } else {
    // Fall back to static items + CMS custom items
    navItems = [
      ...buildNavigation(staticNavItems),
      ...(navigation?.customMenuItems ?? []),
    ];
  }

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      {/* Top row: logo, (search + Bli medlem) left, mobile menu right */}
      <div className="max-w-7xl mx-auto w-full h-16 px-4 sm:px-8 flex items-center justify-between  gap-4">
        <div className="font-bold flex-shrink-0 flex items-center gap-3">
          {logo && (
            <Link href="/" className="flex items-center w-10">
              <SanityImage
                image={logo}
                alt={companyName}
                width={100}
                height={100}
                className="object-contain w-full h-full"
                sizes="100px"
              />
            </Link>
          )}
          <p className="text-xl font-bold">
            <Link href={ROUTE_BASE.HOME}>{companyName}</Link>
          </p>
        </div>
        <div className="flex-1 min-w-0" />
        <div className="flex items-center justify-end gap-2  w-full max-w-lg">
          <div className="hidden sm:flex items-center gap-2 w-full justify-end">
            <SearchBar items={searchItems} />
            {bliMedlemUrl && (
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="shrink-0"
              >
                <Link
                  href={bliMedlemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center no-underline gap-2"
                >
                  <Heart className="size-4" />
                  Bli medlem
                </Link>
              </Button>
            )}
          </div>
          <MobileNav items={navItems} bliMedlemUrl={bliMedlemUrl} searchItems={searchItems} />
        </div>
      </div>
      {/* Full nav: links in a second row (hidden only on small screens) */}
      <div className="hidden sm:block border-t border-gray-200">
        <div className="max-w-7xl mx-auto w-full px-4 py-2 flex justify-start">
          <MainNav items={navItems} align="left" />
        </div>
      </div>
    </header>
  );
}
