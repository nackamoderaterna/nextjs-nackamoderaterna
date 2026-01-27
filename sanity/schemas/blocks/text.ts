import { defineField, defineType } from "sanity";

export const text = defineType({
  name: "block.text",
  title: "Text",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "string",
    }),
    defineField({
      name: "content",
      title: "Innehåll",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Text",
      };
    },
  },
});
