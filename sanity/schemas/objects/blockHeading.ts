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
  ],
});
