import Link from "next/link";
import {
  getMenuItemHref,
  MenuItemWithReference,
} from "@/lib/queries/navigation";
import { NavDropdown } from "./NavDropdown";

export function MainNav({ items }: { items: MenuItemWithReference[] }) {
  return (
    <nav className="hidden md:flex items-center space-x-1">
      {items.map((item, index) => (
        <NavItem key={index} item={item} />
      ))}
    </nav>
  );
}

function NavItem({ item }: { item: MenuItemWithReference }) {
  const hasChildren = item.children && item.children.length > 0;
  const href = getMenuItemHref(item);

  if (!hasChildren) {
    return (
      <Link
        href={href}
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        {...(item.linkType === "external" && {
          target: "_blank",
          rel: "noopener noreferrer",
        })}
      >
        {item.title}
      </Link>
    );
  }

  return <NavDropdown item={item} />;
}
