/**
 * Converts an array of Portable Text blocks to a plain-text string,
 * joining all spans across all blocks, truncated to maxLength characters.
 */
export function portableTextToPlainText(
  blocks: unknown[],
  maxLength = 160,
): string | undefined {
  if (!Array.isArray(blocks) || blocks.length === 0) return undefined;

  const text = blocks
    .map((block: unknown) => {
      if (
        typeof block === "object" &&
        block !== null &&
        (block as Record<string, unknown>)._type === "block" &&
        Array.isArray((block as Record<string, unknown>).children)
      ) {
        return (
          (block as Record<string, unknown>).children as Array<{
            text?: string;
          }>
        )
          .map((child) => child.text || "")
          .join("");
      }
      return "";
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return undefined;
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 1) + "…";
}
