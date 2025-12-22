"use client";

import Link from "next/link";
import {
  getMenuItemHref,
  MenuItemWithReference,
} from "@/lib/queries/navigation";
import { MenuItem } from "~/sanity.types";
import { IconChevronDown } from "@tabler/icons-react";

export function NavDropdown({ item }: { item: MenuItemWithReference }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
        {item.title}
        <IconChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
      </button>

      <div className="absolute left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        {item.children?.map((child, index) => (
          <DropdownItem key={index} item={child} />
        ))}
      </div>
    </div>
  );
}

function DropdownItem({ item }: { item: MenuItemWithReference }) {
  const hasChildren = item.children && item.children.length > 0;
  const href = getMenuItemHref(item);

  if (!hasChildren) {
    return (
      <Link
        href={href}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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
    <div className="relative group/sub">
      <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer">
        {item.title}
        <IconChevronDown className="w-4 h-4 -rotate-90" />
      </div>

      <div className="absolute left-full top-0 ml-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all">
        {item.children?.map((child, index) => (
          // <Link
          //   key={index}
          //   href={getMenuItemHref(child)}
          //   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          //   {...(child.linkType === "external" && {
          //     target: "_blank",
          //     rel: "noopener noreferrer",
          //   })}
          // >
          //   {child.title}
          // </Link>
          <p>Hello</p>
        ))}
      </div>
    </div>
  );
}
