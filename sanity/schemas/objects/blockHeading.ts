import { defineField, defineType } from "sanity";

/**
 * Reusable heading object for block schemas.
 * Provides consistent title + subtitle structure across all blocks.
 */
export const blockHeading = defineType({
  name: "blockHeading",
  title: "Blockrubrik",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Underrubrik",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "anchorId",
      title: "Länk-id",
      description:
        "Gör rubriken länkbar, t.ex. till en meny eller en annan sida (#lankid). Skriv ett eget id, t.ex. mitt-lankid.",
      type: "slug",
      options: {
        // No `source`/Generate button: nested slugs like this one resolve their
        // source against the document root rather than this object, which would
        // pick up the page's title instead of this block's own title. Manual
        // entry only avoids that mismatch entirely.
        isUnique: () => true,
      },
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value?.current) return true;
          return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value.current)
            ? true
            : 'Endast gemener, siffror och bindestreck är tillåtna (t.ex. "mitt-lankid").';
        }),
    }),
  ],
});

/** Prefixes a Studio preview subtitle with a link indicator when the heading has an anchorId set */
export function withAnchorBadge(
  subtitle: string | undefined,
  anchorId: string | undefined
): string | undefined {
  if (!anchorId) return subtitle;
  return subtitle ? `🔗 ${subtitle}` : "🔗 Länkbar rubrik";
}
