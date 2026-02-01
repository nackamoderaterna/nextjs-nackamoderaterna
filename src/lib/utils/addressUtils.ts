export interface Address {
  street?: string;
  zip?: string;
  city?: string;
  country?: string;
}

/**
 * Formats an address into an array of display lines.
 * Combines zip + city when both present.
 */
export function formatAddress(
  address: Address | null | undefined
): string[] | null {
  if (!address) return null;
  const parts = [
    address.street,
    address.zip && address.city
      ? `${address.zip} ${address.city}`
      : address.zip || address.city,
    address.country,
  ].filter((p): p is string => Boolean(p));
  return parts.length > 0 ? parts : null;
}

/** Removes invisible Unicode (zero-width spaces, joiners, BOM, etc.) from a string. */
function stripInvisibleChars(str: string): string {
  return str
    .replace(/[\u200B-\u200F\u202A-\u202E\u2060\u2066-\u2069\uFEFF]/g, "")
    .trim();
}

/**
 * Returns a clean address string suitable for URLs (e.g. Google Maps).
 * Strips invisible Unicode characters and normalizes whitespace.
 */
export function formatAddressForUrl(
  address: Address | null | undefined
): string {
  const parts = formatAddress(address);
  if (!parts) return "";
  const joined = parts
    .map((p) => stripInvisibleChars(p))
    .filter(Boolean)
    .join(", ")
    .replace(/\s+/g, " ")
    .trim();
  return stripInvisibleChars(joined);
}
