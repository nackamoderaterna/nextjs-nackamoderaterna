"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useBreadcrumbTitle } from "./BreadcrumbTitleContext";

const SEGMENT_LABELS: Record<string, string> = {
  politik: "Politik",
  kategori: "Kategorier",
  omrade: "Områden",
  sakfragor: "Sakfrågor",
  politiker: "Politiker",
  nyheter: "Nyheter",
  evenemang: "Evenemang",
  kontakt: "Kontakt",
};

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function Breadcrumb() {
  const pathname = usePathname();
  const breadcrumbTitle = useBreadcrumbTitle();

  if (pathname === "/") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const items: { href: string; label: string; isLast: boolean }[] = [
    { href: "/", label: "Hem", isLast: false },
  ];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    const label =
      isLast && breadcrumbTitle?.title
        ? breadcrumbTitle.title
        : SEGMENT_LABELS[segment] ?? humanizeSlug(segment);
    items.push({ href: currentPath, label, isLast });
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-border bg-muted/30 px-4 py-3"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <span
            key={item.href}
            className={`flex items-center gap-2 ${item.isLast ? "min-w-0 flex-1" : "shrink-0"}`}
          >
            {index > 0 && (
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60" />
            )}
            {item.isLast ? (
              <span
                className="font-medium text-foreground block truncate"
                aria-current="page"
                title={item.label}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground hover:underline transition-colors shrink-0"
              >
                {item.label}
              </Link>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
