import { defineType } from "sanity";

export const geographicalArea = defineType({
  name: "geographicalArea",
  title: "Geografiskt område",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Namn",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      description: "URL-vänlig identifierare för området. Genereras automatiskt från namnet.",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "image",
      title: "Huvudbild",
      description: "Huvudbild som visas på områdets sida och i listningar.",
      type: "image",
      options: {
        hotspot: false,
      },
    },
    {
      name: "description",
      title: "Beskrivning",
      description: "Beskrivning av det geografiska området. Visas på områdets sida.",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "type",
    },
  },
});
