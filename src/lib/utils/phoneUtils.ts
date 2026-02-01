/**
 * Formats a phone number for display as XXX-XXX XX XX.
 * Strips all non-digit characters, then groups digits as 3-3-2-2.
 */
export function formatPhoneNumber(input: string | null | undefined): string {
  if (input == null || typeof input !== "string") return "";
  const digits = input.replace(/\D/g, "");
  if (digits.length === 0) return "";
  const parts: string[] = [];
  let i = 0;
  const lengths = [3, 3, 2, 2];
  for (const len of lengths) {
    if (i >= digits.length) break;
    parts.push(digits.slice(i, i + len));
    i += len;
  }
  if (i < digits.length) {
    parts.push(digits.slice(i));
  }
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]}-${parts[1]}`;
  if (parts.length === 3) return `${parts[0]}-${parts[1]} ${parts[2]}`;
  return `${parts[0]}-${parts[1]} ${parts[2]} ${parts[3]}`;
}
