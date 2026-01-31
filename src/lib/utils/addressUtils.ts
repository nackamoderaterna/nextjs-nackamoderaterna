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
  ].filter(Boolean);
  return parts.length > 0 ? parts : null;
}
