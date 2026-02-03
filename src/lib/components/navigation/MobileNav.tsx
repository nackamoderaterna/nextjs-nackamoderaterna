"use client";

import {
  getMenuItemHref,
  MenuItemWithReference,
} from "@/lib/queries/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/lib/components/ui/sheet";
import { Button } from "@/lib/components/ui/button";
import { Separator } from "@/lib/components/ui/separator";
import { Heart, Menu } from "lucide-react";
import { SearchBar } from "../search/SearchBar";

export function MobileNav({
  items,
  bliMedlemUrl,
}: {
  items: MenuItemWithReference[];
  bliMedlemUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="sm:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col overflow-hidden sm:w-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>Meny</SheetHeader>
        <div className="min-h-0 overflow-y-auto flex flex-col">
          {/* Nav first in DOM (first in tab order), but visually second */}
          <nav className="order-last flex flex-col gap-1 px-4 pb-8">
            {items.map((item) => (
              <Link
                key={item.title}
                href={getMenuItemHref(item)}
                onClick={() => setOpen(false)}
                className="py-2 text-lg font-medium transition-colors hover:text-primary"
              >
                {item.title}
              </Link>
            ))}
          </nav>
          {/* Search last in DOM (last in tab order), but visually first */}
          <div className="order-first px-4 pb-4">
            <SearchBar />
          </div>
        </div>
        {bliMedlemUrl && (
          <>
            <Separator className="my-0" />
            <div className="shrink-0 p-4">
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="w-full justify-center gap-2"
              >
                <Link
                  href={bliMedlemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center no-underline gap-2"
                >
                  Bli medlem
                  <Heart className="size-4" fill="currentColor" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
