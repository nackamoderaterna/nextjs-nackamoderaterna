import {
  MenuItemWithReference,
  NavigationData,
  navigationQuery,
} from "@/lib/queries/navigation";
import { MobileNav } from "./MobileNav";
import { sanityClient } from "@/lib/sanity/client";
import { MainNav } from "./MainNav";

export async function Navigation() {
  const navigation = await sanityClient.fetch<NavigationData>(navigationQuery);

  if (!navigation || !navigation.items) {
    return null;
  }

  return (
    <>
      <MainNav items={navigation.items} />{" "}
      <MobileNav items={navigation.items} />
    </>
  );
}
