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
        "Gör rubriken länkbar, t.ex. till en meny eller en annan sida (#lankid). Klicka på 'Generate' för att skapa baserat på titeln, eller skriv ett eget.",
      type: "slug",
      options: {
        // A plain string source resolves against the document root, which would
        // pick up the page's title instead of this block's own title. Resolving
        // via `options.parent` targets the immediate blockHeading object instead.
        source: (_doc, options) => {
          const parent = options?.parent as { title?: string } | undefined;
          return parent?.title ?? "";
        },
        maxLength: 96,
        isUnique: () => true,
        slugify: (input: string) =>
          input
            // Strip invisible unicode characters (zero-width spaces, BOM, etc.)
            // that sneak in via copy-paste from Word/Google Docs.
            .replace(/[\u200B\u200C\u200D\uFEFF\u200E\u200F\u2060\u00AD\u202A-\u202E\u2066-\u2069]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 96),
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
