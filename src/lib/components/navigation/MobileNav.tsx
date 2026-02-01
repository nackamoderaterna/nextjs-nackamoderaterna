"use client";
import {
  getMenuItemHref,
  MenuItemWithReference,
} from "@/lib/queries/navigation";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import { useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/lib/components/ui/sheet";
import { Button } from "@/lib/components/ui/button";
import { ChevronDown, Menu } from "lucide-react";
import { SearchBar } from "../search/SearchBar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/lib/components/ui/collapsible";

export function MobileNav({ items }: { items: MenuItemWithReference[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex h-full w-full flex-col overflow-hidden sm:w-md">
        <SheetHeader>Meny</SheetHeader>
        <div className="px-4">
          <SearchBar />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-4 px-4 pb-8 pt-4">
          {items.map((item) => {
            if (item.children) {
              return (
                <Collapsible key={item.title}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-lg font-medium">
                    {item.title}
                    <ChevronDown className="w-5 h-5" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 pt-2 flex flex-col gap-2">
                    {item.children.map((child) =>
                      child.children && child.children.length > 0 ? (
                        <Collapsible key={child.title}>
                          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-muted-foreground hover:text-primary transition-colors">
                            {child.title}
                            <ChevronDown className="w-5 h-5 shrink-0" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-4 flex flex-col gap-1">
                            <Link
                              href={getMenuItemHref(child)}
                              onClick={() => setOpen(false)}
                              className="py-1.5 text-sm text-muted-foreground hover:text-primary"
                            >
                              Alla kategorier
                            </Link>
                            {child.children.map((grandchild) => {
                              const Icon = getLucideIcon(grandchild.icon?.name);
                              return (
                                <Link
                                  key={grandchild.title}
                                  href={getMenuItemHref(grandchild)}
                                  onClick={() => setOpen(false)}
                                  className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground hover:text-primary pl-2"
                                >
                                  {Icon && (
                                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                                  )}
                                  {grandchild.title}
                                </Link>
                              );
                            })}
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <Link
                          key={child.title}
                          href={getMenuItemHref(child)}
                          onClick={() => setOpen(false)}
                          className="py-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                          {child.title}
                        </Link>
                      )
                    )}
                  </CollapsibleContent>
                </Collapsible>
              );
            }
            return (
              <Link
                key={item.title}
                href={getMenuItemHref(item)}
                onClick={() => setOpen(false)}
                className="py-2 text-lg font-medium transition-colors hover:text-primary"
              >
                {item.title}
              </Link>
            );
          })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
