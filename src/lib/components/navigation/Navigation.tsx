import { MenuItemWithReference } from "@/lib/queries/navigation";
import { MobileNav } from "./MobileNav";
import { MainNav } from "./MainNav";

export function Navigation({ items }: { items: MenuItemWithReference[] }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      <MainNav items={items} />
      <MobileNav items={items} />
    </>
  );
}
