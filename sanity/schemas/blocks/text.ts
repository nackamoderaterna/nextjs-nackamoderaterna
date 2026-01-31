import { defineField, defineType } from "sanity";

export const text = defineType({
  name: "block.text",
  title: "Text",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "blockHeading",
    }),
    defineField({
      name: "content",
      title: "Innehåll",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "columns",
      title: "Kolumner",
      description: "Antal kolumner för textinnehållet. Innehållet flödar automatiskt mellan kolumnerna.",
      type: "number",
      options: {
        list: [
          { title: "1 kolumn", value: 1 },
          { title: "2 kolumner", value: 2 },
        ],
      },
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      columns: "columns",
      "headingTitle": "heading.title",
    },
    prepare(selection) {
      const cols = `${selection.columns} kolumner`;
      return {
        title: "Text",
        subtitle: selection.headingTitle ? `${selection.headingTitle} - ${cols}` : cols,
      };
    },
  },
});
