import { defineField, defineType } from "sanity";

export const geographicalAreasBlock = defineType({
  name: "block.geographicalAreas",
  title: "Geografiska områden",
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
      title: "Geografiska områden",
      description: "Välj vilka geografiska områden som ska visas.",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "geographicalArea" }],
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
        title: "Geografiska områden",
        subtitle: heading || `${items?.length ?? 0} områden`,
      };
    },
  },
});
