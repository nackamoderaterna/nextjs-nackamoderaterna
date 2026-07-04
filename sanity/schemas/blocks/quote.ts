import { defineField, defineType } from "sanity";
import { withAnchorBadge } from "../objects/blockHeading";

export const quoteBlock = defineType({
  name: "block.quote",
  title: "Citat",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "blockHeading",
    }),
    defineField({
      name: "quote",
      title: "Citat",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Författare",
      type: "string",
    }),
    defineField({
      name: "authorTitle",
      title: "Författarens titel",
      type: "string",
      description: "T.ex. 'Kommunalråd' eller 'Ordförande'",
    }),
    defineField({
      name: "authorImage",
      title: "Författarens bild",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "alignment",
      title: "Justering",
      description: "Hur citatet ska justeras horisontellt.",
      type: "string",
      options: {
        list: [
          { title: "Vänster", value: "left" },
          { title: "Centrerat", value: "center" },
          { title: "Höger", value: "right" },
        ],
      },
      initialValue: "center",
    }),
  ],
  preview: {
    select: {
      quote: "quote",
      author: "author",
      headingAnchorId: "heading.anchorId.current",
    },
    prepare({ quote, author, headingAnchorId }) {
      const preview = quote ? quote.substring(0, 50) + "..." : "Inget citat";
      return {
        title: "Citat",
        subtitle: withAnchorBadge(
          author ? `${preview} - ${author}` : preview,
          headingAnchorId
        ),
      };
    },
  },
});
