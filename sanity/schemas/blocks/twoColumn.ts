import { defineField, defineType } from "sanity";

export const twoColumnBlock = defineType({
  name: "block.twoColumn",
  title: "Text och bild",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "string",
      description: "Valfri rubrik som visas ovanför blocket",
    }),
    defineField({
      name: "image",
      title: "Bild",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Textinnehåll",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imagePosition",
      title: "Bildens position",
      description: "Välj om bilden ska visas till vänster eller höger om texten",
      type: "string",
      options: {
        list: [
          { title: "Vänster", value: "left" },
          { title: "Höger", value: "right" },
        ],
      },
      initialValue: "left",
    }),
    defineField({
      name: "verticalAlignment",
      title: "Vertikal justering av text",
      description: "Hur texten ska justeras vertikalt i förhållande till bilden",
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
    select: {
      heading: "heading",
      imagePosition: "imagePosition",
    },
    prepare({ heading, imagePosition }) {
      return {
        title: heading || "Text och bild",
        subtitle: `Bild ${imagePosition === "right" ? "höger" : "vänster"}`,
      };
    },
  },
});
