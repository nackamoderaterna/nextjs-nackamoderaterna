"use client";
import { MenuItemWithReference } from "@/lib/queries/navigation";
import { useState } from "react";
import { MobileNavItem } from "./MobileNav";

export function MobileNav({ items }: { items: MenuItemWithReference[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 hover:bg-gray-100 rounded-md"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <ItemMenu2 className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <nav className="px-4 py-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {items.map((item, index) => (
              <MobileNavItem
                key={index}
                item={item}
                onNavigate={() => setIsOpen(false)}
              />
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
