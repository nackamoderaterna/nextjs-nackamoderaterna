"use client";
import {
  getMenuItemHref,
  MenuItemWithReference,
} from "@/lib/queries/navigation";
import { useState } from "react";
import { IconChevronDown, IconMenu2, IconX } from "@tabler/icons-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu } from "lucide-react";
import { SearchBar } from "../search/SearchBar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function MobileNav({ items }: { items: MenuItemWithReference[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px]">
        <SheetHeader>Meny</SheetHeader>
      <SearchBar />
        <nav className="flex flex-col gap-4 mt-8 px-4">
          {items.map((item) => {
            if (item.children) {
              return (
                <Collapsible key={item.title}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-lg font-medium">
                    {item.title}
                    <ChevronDown className="w-5 h-5" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 pt-2 flex flex-col gap-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.title}
                        href={getMenuItemHref(child)}
                        onClick={() => setOpen(false)}
                        className="py-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        {child.title}
                      </Link>
                    ))}
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
      </SheetContent>
    </Sheet>
  );
}
