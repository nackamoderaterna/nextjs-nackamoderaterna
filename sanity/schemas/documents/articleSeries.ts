import { defineType } from "sanity";

export const articleSeries = defineType({
  name: "articleSeries",
  title: "Artikelserie",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      description:
        "URL-vänlig identifierare för artikelserien. Genereras automatiskt från titeln.",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Beskrivning",
      description: "Valfritt: kort beskrivning av artikelserien.",
      type: "text",
      rows: 3,
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});

