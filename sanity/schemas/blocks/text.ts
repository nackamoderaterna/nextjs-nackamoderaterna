import { defineField, defineType } from "sanity";

export const text = defineType({
  name: "block.text",
  title: "Text Block",
  type: "object",
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "columns",
      title: "Text Columns",
      description: "One column is 65ch wide",
      type: "number",
      options: {
        list: [
          { title: "1 Column", value: 1 },
          { title: "2 Columns", value: 2 },
        ],
        layout: "radio",
      },
      initialValue: 1,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Text Block",
      };
    },
  },
});
