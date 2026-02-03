import { defineField, defineType } from "sanity";

export default defineType({
  name: "buttonWithIcon",
  title: "Knapp",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Knapptext",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "Länk",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Ikon (valfri)",
      type: "lucideIcon",
      description: "Visas före knapptexten",
    }),
  ],
  preview: {
    select: { label: "label", icon: "icon.name" },
    prepare({ label, icon }: { label?: string; icon?: string }) {
      return {
        title: label || "Knapp",
        subtitle: icon ? `Ikon: ${icon}` : undefined,
      };
    },
  },
});
