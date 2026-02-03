const NEWS_BASE = "/nyheter";

export function buildNewsFilterUrl(
  areaSlug?: string | null,
  typeParam?: string | null
): string {
  const params = new URLSearchParams();
  if (areaSlug) params.set("area", areaSlug);
  if (typeParam) params.set("type", typeParam);
  const qs = params.toString();
  return qs ? `${NEWS_BASE}?${qs}` : NEWS_BASE;
}

export function parseNewsFilterParams(searchParams: URLSearchParams): {
  areaSlug: string | null;
  typeParam: string | null;
} {
  return {
    areaSlug: searchParams.get("area") || null,
    typeParam: searchParams.get("type") || null,
  };
}
