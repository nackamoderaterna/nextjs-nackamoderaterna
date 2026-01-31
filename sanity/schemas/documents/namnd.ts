import { defineField, defineType } from "sanity";

export const namnd = defineType({
  name: "namnd",
  title: "Nämnd",
  type: "document",
  groups: [
    { name: "content", title: "Innehåll", default: true },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
