import { defineField, defineType } from "sanity";

export const geographicalArea = defineType({
  name: "geographicalArea",
  title: "Geografiskt område",
  type: "document",
  groups: [
    { name: "content", title: "Innehåll", default: true },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Namn",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "URL-vänlig identifierare för området. Genereras automatiskt från namnet.",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivning",
      description: "Beskrivning av det geografiska området. Visas på områdets sida.",
      type: "array",
      group: "content",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "image",
      title: "Huvudbild",
      description: "Huvudbild som visas på områdets sida och i listningar.",
      type: "image",
      group: "media",
      options: {
        hotspot: false,
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "type",
    },
  },
});
