import Link from "next/link";
import { Navigation } from "../navigation/Navigation";
import { SearchBar } from "../search/SearchBar";
import { sanityClient } from "@/lib/sanity/client";
import {
  navigationQuery,
  NavigationData,
  navigationGeographicalAreasQuery,
  navigationPoliticalAreasQuery,
  NavigationAreaItem,
} from "@/lib/queries/navigation";
import { staticNavItems } from "@/lib/navigation/staticNav";
import { buildNavigation } from "@/lib/navigation/buildNavigation";
import { globalSettingsQuery } from "@/lib/queries/globalSettings";
import { SanityImage } from "./SanityImage";
import { ROUTE_BASE } from "@/lib/routes";

export default async function Header() {
  const [navigation, globalSettings, geographicalAreas, politicalAreas] =
    await Promise.all([
      sanityClient.fetch<NavigationData>(navigationQuery),
      sanityClient.fetch<{ companyName?: string; logo?: any }>(
        globalSettingsQuery
      ),
      sanityClient.fetch<NavigationAreaItem[]>(navigationGeographicalAreasQuery),
      sanityClient.fetch<NavigationAreaItem[]>(navigationPoliticalAreasQuery),
    ]);

  const companyName = globalSettings?.companyName || "Nackamoderaterna";
  const logo = globalSettings?.logo;

  return (
    <header className="w-full h-16 p-4 flex items-center border-b border-gray-200 bg-white">
      <div
        className={`max-w-7xl mx-auto w-full items-center flex flex-wrap justify-between gap-4`}
      >
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
          <h2 className="text-xl font-bold w-full">
            <Link href={ROUTE_BASE.HOME}>{companyName}</Link>
          </h2>
        </div>
        <div className="flex-1 min-w-[200px] hidden md:block max-w-md">
          <SearchBar />
        </div>
        <div className="flex-shrink-0">
          <Navigation
            items={[
              ...buildNavigation(
                staticNavItems,
                geographicalAreas ?? [],
                politicalAreas ?? []
              ),
              ...(navigation?.customMenuItems ?? []),
            ]}
          />
        </div>
      </div>
    </header>
  );
}
