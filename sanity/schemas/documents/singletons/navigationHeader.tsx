import { defineField, defineType } from "sanity";

export default defineType({
  name: "navigationHeader",
  title: "Header Navigation",
  type: "document",
  groups: [{ name: "menu", title: "Meny" }],
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
      title: "Menu Items (deprecated)",
      type: "array",
      group: "menu",
      of: [{ type: "menuItem" }],
      description:
        "Deprecated. Core navigation comes from the app. Use Extra menu items below to add custom links.",
      hidden: true,
    }),
    defineField({
      name: "customMenuItems",
      title: "Extra menypunkter",
      type: "array",
      group: "menu",
      of: [{ type: "menuItem" }],
      description:
        "Lägg till extra länkar som visas efter de vanliga menyobjekten (Hem, Politik, Politiker, etc.).",
    }),
  ],
});
