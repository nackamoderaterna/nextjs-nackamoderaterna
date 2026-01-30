import { defineField, defineType } from "sanity";

export const politicalAreasBlock = defineType({
  name: "block.politicalAreas",
  title: "Politiska områden",
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
      name: "items",
      title: "Politiska områden",
      description: "Välj vilka politiska områden som ska visas.",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "politicalArea" }],
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      items: "items",
    },
    prepare({ heading, items }: { heading?: string; items?: unknown[] }) {
      return {
        title: "Politiska områden",
        subtitle: heading || `${items?.length ?? 0} områden`,
      };
    },
  },
});
