import { defineField, defineType } from "sanity";

export const twoColumnBlock = defineType({
  name: "block.twoColumn",
  title: "Text och bild",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "blockHeading",
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
      name: "innerTitle",
      title: "Rubrik i textkolumn",
      type: "string",
      description: "Rubrik som visas ovanför texten (inuti blocket)",
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
    defineField({
      name: "textAlignment",
      title: "Horisontell justering av text",
      description: "Hur texten ska justeras horisontellt",
      type: "string",
      options: {
        list: [
          { title: "Vänster", value: "left" },
          { title: "Centrerat", value: "center" },
          { title: "Höger", value: "right" },
        ],
      },
      initialValue: "left",
    }),
  ],
  preview: {
    select: {
      headingTitle: "heading.title",
      innerTitle: "innerTitle",
      imagePosition: "imagePosition",
    },
    prepare({ headingTitle, innerTitle, imagePosition }) {
      return {
        title: headingTitle || innerTitle || "Text och bild",
        subtitle: `Bild ${imagePosition === "right" ? "höger" : "vänster"}`,
      };
    },
  },
});
