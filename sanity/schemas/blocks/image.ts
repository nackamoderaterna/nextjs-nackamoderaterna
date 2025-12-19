import { defineField, defineType } from "sanity";

export const imageBlock = defineType({
  name: "block.image",
  title: "Image Block",
  type: "object",
  groups: [{ name: "blockSettings", title: "Block Settings" }],
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Important for SEO and accessibility",
        },
      ],
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "aspectRatio",
      title: "Aspect Ratio",
      type: "string",
      options: {
        list: [
          { title: "16:9 (Landscape)", value: "16/9" },
          { title: "4:3", value: "4/3" },
          { title: "1:1 (Square)", value: "1/1" },
          { title: "9:16 (Portrait)", value: "9/16" },
          { title: "Auto", value: "auto" },
        ],
      },
      initialValue: "auto",
    }),
  ],
  preview: {
    select: {
      title: "caption",
      media: "image",
    },
    prepare({ title, media }) {
      return {
        title: title || "Media Block",
        subtitle: "Image",
        media,
      };
    },
  },
});
