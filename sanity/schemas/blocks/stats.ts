import { defineField, defineType } from "sanity";

export const statsBlock = defineType({
  name: "block.stats",
  title: "Statistik",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Beskrivning",
      type: "text",
    }),
    defineField({
      name: "stats",
      title: "Statistik",
      description: "Lista med statistik som ska visas. Max 4 statistik.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "Värde",
              type: "string",
              validation: (Rule) => Rule.required(),
              description: "T.ex. '1,234' eller '95%'",
            }),
            defineField({
              name: "label",
              title: "Etikett",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Beskrivning",
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
  ],
  preview: {
    select: {
      heading: "heading",
      stats: "stats",
    },
    prepare({ heading, stats }) {
      return {
        title: "Statistik",
        subtitle: heading || `${stats?.length || 0} statistik`,
      };
    },
  },
});
