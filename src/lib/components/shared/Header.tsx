import Link from "next/link";
import { MainNav } from "../navigation/MainNav";
import { MobileNav } from "../navigation/MobileNav";
import { SearchBar } from "../search/SearchBar";
import { Button } from "@/lib/components/ui/button";
import { sanityClient } from "@/lib/sanity/client";
import {
  navigationQuery,
  NavigationData,
} from "@/lib/queries/navigation";
import { staticNavItems } from "@/lib/navigation/staticNav";
import { buildNavigation } from "@/lib/navigation/buildNavigation";
import { globalSettingsQuery } from "@/lib/queries/globalSettings";
import { SanityImage } from "./SanityImage";
import { ROUTE_BASE } from "@/lib/routes";
import { Heart } from "lucide-react";

export default async function Header() {
  const [navigation, globalSettings] = await Promise.all([
    sanityClient.fetch<NavigationData>(navigationQuery),
    sanityClient.fetch<{
      companyName?: string;
      logo?: any;
      bliMedlemUrl?: string | null;
    }>(globalSettingsQuery),
  ]);

  const companyName = globalSettings?.companyName || "Nackamoderaterna";
  const logo = globalSettings?.logo;
  const bliMedlemUrl = globalSettings?.bliMedlemUrl;

  const navItems = [
    ...buildNavigation(staticNavItems),
    ...(navigation?.customMenuItems ?? []),
  ];

  return (
    <header className="w-full h-16 p-4 flex items-center border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4">
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
          <h2 className="text-xl font-bold">
            <Link href={ROUTE_BASE.HOME}>{companyName}</Link>
          </h2>
          {bliMedlemUrl && (
            <Button asChild variant="default" size="sm" className="hidden lg:inline-flex">
              <Link
                href={bliMedlemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center no-underline gap-2"
              >
                Bli medlem
                <Heart className="size-4" />
              </Link>
            </Button>
          )}
        </div>
        <div className="flex-1 hidden lg:block max-w-md">
          <SearchBar />
        </div>
        <div className="flex-shrink-0">
          <MainNav items={navItems} />
          <MobileNav items={navItems} />
        </div>
      </div>
    </header>
  );
}
