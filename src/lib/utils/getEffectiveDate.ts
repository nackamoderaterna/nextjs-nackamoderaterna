/**
 * Gets the effective date from a news item, preferring dateOverride over _createdAt
 */
export function getEffectiveDate(item: {
  dateOverride?: string | null;
  _createdAt?: string;
  effectiveDate?: string;
}): string {
  if (item.effectiveDate) {
    return item.effectiveDate;
  }
  return item.dateOverride || item._createdAt || new Date().toISOString();
}
