import { defineField, defineType } from "sanity";

export const eventType = defineType({
  name: "eventType",
  title: "Evenemangstyp",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Namn",
      type: "string",
      description: 'T.ex. "Möte", "Konferens", "Kampanj"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description:
        "URL-vänlig identifierare för evenemangstypen. Genereras automatiskt från namnet.",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
  },
});
