"use client";
import Link from "next/link";
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
import { navigationMenuTriggerStyle } from "@/lib/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function MainNav({ items }: { items: MenuItemWithReference[] }) {
  return (
    <nav className="hidden lg:flex flex-1 items-center justify-center gap-1">
      {items.map((item) => (
        <DesktopNavItem item={item} key={item.title} />
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

function DesktopNavItem({ item }: { item: MenuItemWithReference }) {
  const hasChildren = item.children && item.children.length > 0;
  const href = getMenuItemHref(item);
  const isExternal = item.linkType === "external";

  if (!hasChildren) {
    return (
      <NavLink
        href={href}
        isExternal={isExternal}
        className={cn(navigationMenuTriggerStyle())}
      >
        {item.title}
      </NavLink>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          navigationMenuTriggerStyle(),
          "data-[state=open]:bg-accent/50"
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
