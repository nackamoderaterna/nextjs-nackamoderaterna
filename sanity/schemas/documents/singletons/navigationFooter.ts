import { defineField, defineType } from "sanity";

export default defineType({
  name: "navigationFooter",
  title: "Footer Navigation",
  type: "document",
  groups: [
    { name: "structure", title: "Struktur", default: true },
    { name: "content", title: "Innehåll" },
  ],
  fields: [
    defineField({
      name: "columns",
      title: "Footer Columns",
      type: "array",
      group: "structure",
      of: [
        {
          type: 'object',
          name: 'footerColumn',
          title: 'Footer Column',
          fields: [
            defineField({
              name: 'title',
              title: 'Column Title',
              type: 'string',
            }),
            defineField({
              name: 'items',
              title: 'Menu Items',
              type: 'array',
              of: [{type: 'menuItem'}],
            }),
          ],
        },
      ],
    }),

    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "array",
      group: "content",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "legalText",
      title: "Legal Text",
      type: "string",
      group: "content",
    }),
  ],
});
