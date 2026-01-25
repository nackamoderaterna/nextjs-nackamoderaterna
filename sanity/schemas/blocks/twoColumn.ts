import { defineField, defineType } from "sanity";

export const twoColumnBlock = defineType({
  name: "block.twoColumn",
  title: "Tvåkolumnsblock",
  type: "object",
  fields: [
    defineField({
      name: "leftContent",
      title: "Vänster innehåll",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rightContent",
      title: "Höger innehåll",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "leftImage",
      title: "Vänster bild",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "rightImage",
      title: "Höger bild",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "reverse",
      title: "Vänd layout",
      description: "Byter plats på vänster och höger kolumn. Användbart för att variera layouten.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "verticalAlignment",
      title: "Vertikal justering",
      description: "Hur innehållet ska justeras vertikalt i kolumnerna.",
      type: "string",
      options: {
        list: [
          { title: "Överst", value: "top" },
          { title: "Centrerat", value: "center" },
          { title: "Nederst", value: "bottom" },
        ],
      },
      initialValue: "top",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Tvåkolumnsblock",
      };
    },
  },
});
