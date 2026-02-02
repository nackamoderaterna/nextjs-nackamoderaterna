"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getMenuItemHref,
  MenuItemWithReference,
} from "@/lib/queries/navigation";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import { ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function itemOrDescendantActive(
  pathname: string,
  item: MenuItemWithReference
): boolean {
  const href = getMenuItemHref(item);
  if (isItemActive(pathname, href)) return true;
  if (item.children) {
    return item.children.some((child) => {
      const childHref = getMenuItemHref(child);
      if (isItemActive(pathname, childHref)) return true;
      if (child.children) {
        return child.children.some((grandchild) =>
          isItemActive(pathname, getMenuItemHref(grandchild))
        );
      }
      return false;
    });
  }
  return false;
}

const navLinkBase =
  "inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1 outline-none";
const navLinkDefault =
  "text-muted-foreground hover:bg-muted/60 hover:text-foreground";
const navLinkActive = "bg-muted/70 text-foreground";

export function MainNav({
  items,
  align = "center",
}: {
  items: MenuItemWithReference[];
  align?: "left" | "center";
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "hidden sm:flex items-center gap-1",
        align === "center" && "flex-1 justify-center",
        align === "left" && "justify-start"
      )}
    >
      {items.map((item) => (
        <DesktopNavItem
          item={item}
          key={item.title}
          pathname={pathname}
          isActive={itemOrDescendantActive(pathname, item)}
        />
      ))}
    </nav>
  );
}

function NavLink({
  href,
  children,
  isExternal,
  className,
}: {
  href: string;
  children: React.ReactNode;
  isExternal?: boolean;
  className?: string;
}) {
  // Use native <a> for href="#" or external links to avoid client-side routing issues
  if (href === "#" || isExternal) {
    return (
      <a
        href={href}
        className={className}
        {...(isExternal && {
          target: "_blank",
          rel: "noopener noreferrer",
        })}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

interface DesktopNavItemProps {
  item: MenuItemWithReference;
  pathname: string;
  isActive: boolean;
}

function DesktopNavItem({ item, pathname, isActive }: DesktopNavItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const href = getMenuItemHref(item);
  const isExternal = item.linkType === "external";
  const linkActive = isItemActive(pathname, href);

  if (!hasChildren) {
    return (
      <NavLink
        href={href}
        isExternal={isExternal}
        className={cn(
          navLinkBase,
          linkActive ? navLinkActive : navLinkDefault
        )}
      >
        {item.title}
      </NavLink>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          navLinkBase,
          isActive ? navLinkActive : navLinkDefault,
          "data-[state=open]:bg-muted/70 data-[state=open]:text-foreground"
        )}
      >
        {item.title}
        <ChevronDownIcon className="relative top-[1px] ml-1 size-3 transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[200px]">
        {item.children?.map((child) =>
          child.children && child.children.length > 0 ? (
            <DropdownMenuSub key={child.title}>
              <DropdownMenuSubTrigger>{child.title}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="min-w-[180px]">
                <DropdownMenuItem asChild>
                  <Link href={getMenuItemHref(child)}>Alla kategorier</Link>
                </DropdownMenuItem>
                {child.children.map((grandchild) => {
                  const Icon = getLucideIcon(grandchild.icon?.name);
                  return (
                    <DropdownMenuItem key={grandchild.title} asChild>
                      <Link
                        href={getMenuItemHref(grandchild)}
                        className="flex items-center gap-2"
                      >
                        {Icon && (
                          <Icon className="size-4 shrink-0 text-muted-foreground" />
                        )}
                        {grandchild.title}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ) : (
            <DropdownMenuItem key={child.title} asChild>
              <Link href={getMenuItemHref(child)}>{child.title}</Link>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
