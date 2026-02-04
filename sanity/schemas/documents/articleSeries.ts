import { defineField, defineType } from "sanity";

export const articleSeries = defineType({
  name: "articleSeries",
  title: "Artikelserie",
  type: "document",
  groups: [{ name: "content", title: "Innehåll" }],
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description:
        "URL-vänlig identifierare för artikelserien. Genereras automatiskt från titeln.",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivning",
      description: "Valfritt: kort beskrivning av artikelserien.",
      type: "text",
      rows: 3,
      group: "content",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});
