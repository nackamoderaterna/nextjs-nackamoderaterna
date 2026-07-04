import { defineField, defineType } from "sanity";
import { withAnchorBadge } from "../objects/blockHeading";

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
      "headingAnchorId": "heading.anchorId.current",
      items: "items",
    },
    prepare({
      headingTitle,
      headingAnchorId,
      items,
    }: {
      headingTitle?: string;
      headingAnchorId?: string;
      items?: unknown[];
    }) {
      return {
        title: "Geografiska områden",
        subtitle: withAnchorBadge(
          headingTitle || `${items?.length ?? 0} områden`,
          headingAnchorId
        ),
      };
    },
  },
});
