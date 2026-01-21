import { defineField, defineType } from "sanity";

export const quoteBlock = defineType({
  name: "block.quote",
  title: "Quote Block",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
    }),
    defineField({
      name: "authorTitle",
      title: "Author Title",
      type: "string",
      description: "e.g., 'Kommunalråd' or 'Ordförande'",
    }),
    defineField({
      name: "authorImage",
      title: "Author Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "alignment",
      title: "Alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
      },
      initialValue: "center",
    }),
  ],
  preview: {
    select: {
      quote: "quote",
      author: "author",
    },
    prepare({ quote, author }) {
      const preview = quote ? quote.substring(0, 50) + "..." : "No quote";
      return {
        title: "Quote Block",
        subtitle: author ? `${preview} - ${author}` : preview,
      };
    },
  },
});
