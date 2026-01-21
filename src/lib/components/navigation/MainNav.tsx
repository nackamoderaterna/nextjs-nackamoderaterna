"use client";
import Link from "next/link";
import {
  getMenuItemHref,
  MenuItemWithReference,
} from "@/lib/queries/navigation";
import useIsMobile from "@/hooks/use-is-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

export function MainNav({ items }: { items: MenuItemWithReference[] }) {
  const { isMobile } = useIsMobile();
  return (
    <NavigationMenu
      viewport={isMobile}
      className={isMobile ? "hidden" : "block"}
    >
      <NavigationMenuList>
        {items.map((item, index) => (
          <DesktopNavItem item={item} key={item.title} />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function DesktopNavItem({ item }: { item: MenuItemWithReference }) {
  const hasChildren = item.children && item.children.length > 0;
  const href = getMenuItemHref(item);

  if (!hasChildren) {
    return (
      <NavigationMenuItem asChild className={navigationMenuTriggerStyle()}>
        <Link
          href={href}
          {...(item.linkType === "external" && {
            target: "_blank",
            rel: "noopener noreferrer",
          })}
        >
          {item.title}
        </Link>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem className="hidden md:block">
      <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
      <NavigationMenuContent className="z-20">
        <ul className="grid w-[200px] gap-4">
          {item.children?.map((child, index) => (
            <li key={child.title + "-" + index}>
              <NavigationMenuLink asChild key={child.title}>
                <Link href={getMenuItemHref(child)}>{child.title}</Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
