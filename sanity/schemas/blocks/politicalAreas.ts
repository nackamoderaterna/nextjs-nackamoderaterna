import { defineField, defineType } from "sanity";

export const politicalAreasBlock = defineType({
  name: "block.politicalAreas",
  title: "Politiska områden",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "blockHeading",
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
      "headingTitle": "heading.title",
      items: "items",
    },
    prepare({ headingTitle, items }: { headingTitle?: string; items?: unknown[] }) {
      return {
        title: "Politiska områden",
        subtitle: headingTitle || `${items?.length ?? 0} områden`,
      };
    },
  },
});
