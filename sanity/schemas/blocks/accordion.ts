import { defineField, defineType } from "sanity";
import { withAnchorBadge } from "../objects/blockHeading";

export const accordionBlock = defineType({
  name: "block.accordion",
  title: "Accordion/FAQ",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "blockHeading",
    }),
    defineField({
      name: "items",
      title: "Objekt",
      description: "Lista med objekt som kan expanderas/kollapsas. Perfekt för FAQ-sektioner.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Titel",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "content",
              title: "Innehåll",
              type: "array",
              of: [{ type: "block" }],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "title",
            },
            prepare({ title }) {
              return {
                title,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "allowMultiple",
      title: "Tillåt flera öppna",
      description: "Om aktiverat kan flera objekt vara öppna samtidigt. Annars stängs det tidigare öppnade objektet när ett nytt öppnas.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      "headingTitle": "heading.title",
      "headingAnchorId": "heading.anchorId.current",
      items: "items",
    },
    prepare({ headingTitle, headingAnchorId, items }) {
      return {
        title: "Accordion",
        subtitle: withAnchorBadge(
          headingTitle || `${items?.length || 0} objekt`,
          headingAnchorId
        ),
      };
    },
  },
});
