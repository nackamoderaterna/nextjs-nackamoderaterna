import Link from "next/link";
mport { MainNav } from "../navigation/MainNav";
import { MobileNav } from "../navigation/MobileNav";
import { SearchBar } from "../search/SearchBar";
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
import { SanityImage } from "./SanityImage";
import { ROUTE_BASE } from "@/lib/routes";
import { Heart } from "lucide-react";

export default async function Header() {
  const [navigation, globalSettings] = await Promise.all([
    sanityClient.fetch<NavigationData>(navigationQuery),
    sanityClient.fetch<GlobalSettingsData>(globalSettingsQuery),
  ]);

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
            <SearchBar />
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
          <MobileNav items={navItems} bliMedlemUrl={bliMedlemUrl} />
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
