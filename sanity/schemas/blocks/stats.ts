import { defineField, defineType } from "sanity";

export const statsBlock = defineType({
  name: "block.stats",
  title: "Statistik",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "blockHeading",
    }),
    defineField({
      name: "stats",
      title: "Statistik",
      description: "Lista med statistik som ska visas. Layouten anpassas automatiskt baserat på antal statistik (1-4).",
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
      "headingTitle": "heading.title",
      stats: "stats",
    },
    prepare({ headingTitle, stats }) {
      return {
        title: "Statistik",
        subtitle: headingTitle || `${stats?.length || 0} statistik`,
      };
    },
  },
});
