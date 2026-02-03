import Link from "next/link";
import { FooterColumn } from "./FooterColumn";
import type {
  FooterColumn as FooterColumnType,
  MenuItemWithReference,
} from "@/lib/queries/navigation";
import { getMenuItemHref } from "@/lib/queries/navigation";
import { ROUTE_BASE } from "@/lib/routes";

const DEFAULT_COLUMNS: { title: string; items: { title: string; href: string }[] }[] = [
  {
    title: "Meny",
    items: [
      { title: "Hem", href: "/" },
      { title: "Politik", href: "/politik" },
      { title: "Nyheter", href: "/nyheter" },
      { title: "Politiker", href: "/politiker" },
    ],
  },
  {
    title: "Övrigt",
    items: [
      { title: "Evenemang", href: ROUTE_BASE.EVENTS },
      { title: "Kontakt", href: "/kontakt" },
    ],
  },
];

interface FooterNavProps {
  columns?: FooterColumnType[];
  mainNavigation?: MenuItemWithReference[] | null;
}

export function FooterNav({ columns, mainNavigation }: FooterNavProps) {
  // Use CMS footer columns if configured
  if (columns?.length) {
    return (
      <>
        {columns.map((column, index) => (
          <FooterColumn
            key={index}
            title={column.title}
            items={column.items}
          />
        ))}
      </>
    );
  }

  // Use main navigation from global settings, filtering out items with children
  if (mainNavigation?.length) {
    const footerItems = mainNavigation.filter(
      (item) => !item.children?.length && item.title
    );

    if (footerItems.length > 0) {
      return (
        <div>
          <h3 className="font-semibold text-foreground mb-4">Meny</h3>
          <ul className="space-y-2">
            {footerItems.map((item, index) => {
              const href = getMenuItemHref(item);
              if (href === "#") return null;
              return (
                <li key={index}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
  }

  // Fallback to default columns
  return (
    <>
      {DEFAULT_COLUMNS.map((column, index) => (
        <div key={index}>
          <h3 className="font-semibold text-foreground mb-4">{column.title}</h3>
          <ul className="space-y-2">
            {column.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
