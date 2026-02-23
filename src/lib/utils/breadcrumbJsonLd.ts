export interface BreadcrumbItem {
  name: string;
  /** Relative path, e.g. "/nyheter". Omit for the last (current) item. */
  url?: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://nackamoderaterna.se";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url !== undefined && { item: `${siteUrl}${item.url}` }),
    })),
  };
}
