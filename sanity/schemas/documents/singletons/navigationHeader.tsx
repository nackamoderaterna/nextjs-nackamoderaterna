import { defineField, defineType } from "sanity";

export default defineType({
  name: "navigationHeader",
  title: "Header Navigation",
  type: "document",
  groups: [
    { name: "menu", title: "Meny", default: true },
  ],
  fields: [
    defineField({
      name: "title",
      title: "title",
      type: "string",
      group: "menu",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "items",
      title: "Menu Items",
      type: "array",
      group: "menu",
      of: [{ type: "menuItem" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});
