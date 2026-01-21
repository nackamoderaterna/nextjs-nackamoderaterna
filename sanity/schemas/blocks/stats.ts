import { defineField, defineType } from "sanity";

export const statsBlock = defineType({
  name: "block.stats",
  title: "Stats Block",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "stats",
      title: "Statistics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (Rule) => Rule.required(),
              description: "e.g., '1,234' or '95%'",
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
          ],
          preview: {
            select: {
              value: "value",
              label: "label",
            },
            prepare({ value, label }) {
              return {
                title: `${value} - ${label}`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "number",
      options: {
        list: [
          { title: "2 Columns", value: 2 },
          { title: "3 Columns", value: 3 },
          { title: "4 Columns", value: 4 },
        ],
      },
      initialValue: 4,
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      stats: "stats",
    },
    prepare({ heading, stats }) {
      return {
        title: "Stats Block",
        subtitle: heading || `${stats?.length || 0} statistics`,
      };
    },
  },
});
