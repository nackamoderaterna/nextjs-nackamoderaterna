import { defineField, defineType } from "sanity";

export const imageGalleryBlock = defineType({
  name: "block.imageGallery",
  title: "Image Gallery Block",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "number",
      options: {
        list: [
          { title: "2 Columns", value: 2 },
          { title: "3 Columns", value: 3 },
          { title: "4 Columns", value: 4 },
        ],
      },
      initialValue: 3,
    }),
    defineField({
      name: "aspectRatio",
      title: "Aspect Ratio",
      type: "string",
      options: {
        list: [
          { title: "Square (1:1)", value: "square" },
          { title: "Landscape (16:9)", value: "landscape" },
          { title: "Portrait (4:5)", value: "portrait" },
          { title: "Auto", value: "auto" },
        ],
      },
      initialValue: "square",
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      images: "images",
    },
    prepare({ heading, images }) {
      return {
        title: "Image Gallery Block",
        subtitle: heading || `${images?.length || 0} images`,
      };
    },
  },
});
