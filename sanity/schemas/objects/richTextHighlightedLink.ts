import { defineType, defineField } from "sanity";

export const richTextHighlightedLink = defineType({
  name: "richTextHighlightedLink",
  title: "Framhävd länk",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Rubrik",
      description: "Rubrik som visas i länkblocket.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivning",
      description: "Beskrivande text som visas under rubriken.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "linkText",
      title: "Länktext",
      description: "Text som visas på länken (t.ex. 'Besök sida').",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "linkUrl",
      title: "Länk-URL",
      description: "URL som länken ska peka på.",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      linkText: "linkText",
    },
    prepare({ title, linkText }) {
      return {
        title: title || "Framhävd länk",
        subtitle: linkText || "Ingen länktext",
      };
    },
  },
});
