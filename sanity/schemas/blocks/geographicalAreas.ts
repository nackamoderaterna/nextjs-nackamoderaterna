import { defineField, defineType } from "sanity";

export const geographicalAreasBlock = defineType({
  name: "block.geographicalAreas",
  title: "Geografiska områden",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "blockHeading",
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
      "headingTitle": "heading.title",
      items: "items",
    },
    prepare({ headingTitle, items }: { headingTitle?: string; items?: unknown[] }) {
      return {
        title: "Geografiska områden",
        subtitle: headingTitle || `${items?.length ?? 0} områden`,
      };
    },
  },
});
