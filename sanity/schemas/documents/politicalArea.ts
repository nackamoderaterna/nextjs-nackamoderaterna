import { defineField, defineType } from "sanity";

export const politicalArea = defineType({
  name: "politicalArea",
  title: "Politiskt område",
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
      description: 'T.ex. "Ekonomi", "Vård", "Klimat och miljö"',
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
      description: "Beskrivning av det politiska området. Visas på områdets sida.",
      type: "array",
      group: "content",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "image",
      title: "Huvudbild",
      description: "Huvudbild som visas i områdets seo.",
      type: "image",
      group: "media",
      options: {
        hotspot: true,
      }, 
    }),
    defineField({
      name: "icon",
      title: "Ikon",
      description: "Ikon som visas i listningar av politiska områden. Välj en ikon från Lucide-biblioteket.",
      type: "lucideIcon",
      group: "media",
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
  },
});
