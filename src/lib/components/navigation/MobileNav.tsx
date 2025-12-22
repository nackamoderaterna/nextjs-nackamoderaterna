"use client";
import {
  getMenuItemHref,
  MenuItemWithReference,
} from "@/lib/queries/navigation";
import { useState } from "react";
import { IconChevronDown, IconMenu2, IconX } from "@tabler/icons-react";
import Link from "next/link";

export function MobileNav({ items }: { items: MenuItemWithReference[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 hover:bg-gray-100 rounded-md"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <IconX className="w-6 h-6" />
        ) : (
          <IconMenu2 className="w-6 h-6" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 bg-white border border-gray-200 shadow-lg z-50">
          <nav className="grid gap-4 p-4 whitespace-nowrap">
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

function MobileNavItem({
  item,
  onNavigate,
  depth = 0,
}: {
  item: MenuItemWithReference;
  onNavigate: () => void;
  depth?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const href = getMenuItemHref(item);
  const paddingLeft = depth * 16;

  if (!hasChildren) {
    return (
      <Link
        href={href}
        className="text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        onClick={onNavigate}
        {...(item.linkType === "external" && {
          target: "_blank",
          rel: "noopener noreferrer",
        })}
      >
        {item.title}
      </Link>
    );
  }

  return (
    <div className="">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex whitespace-nowrap items-center justify-between py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        style={{ paddingLeft: `${paddingLeft + 16}px` }}
      >
        {item.title}
        <IconChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="relative">
          {item.children.map((child, index) => (
            <MobileNavItem
              key={index}
              item={child}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
