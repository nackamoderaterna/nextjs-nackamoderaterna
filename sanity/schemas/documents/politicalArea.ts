import { defineType } from "sanity";

export const politicalArea = defineType({
  name: "politicalArea",
  title: "Politiskt område",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Namn",
      type: "string",
      description: 'T.ex. "Ekonomi", "Vård", "Klimat och miljö"',
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
      name: "description",
      title: "Beskrivning",
      description: "Beskrivning av det politiska området. Visas på områdets sida.",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "image",
      title: "Huvudbild",
      description: "Huvudbild som visas på områdets sida och i listningar.",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "icon",
      title: "Ikon",
      description: "Ikon som visas i listningar av politiska områden. Välj en ikon från Lucide-biblioteket.",
      type: "lucideIcon",
    },
  ],
  preview: {
    select: {
      title: "name",
    },
  },
});
