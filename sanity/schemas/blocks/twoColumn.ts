import { defineField, defineType } from "sanity";

export const twoColumnBlock = defineType({
  name: "block.twoColumn",
  title: "Two Column Block",
  type: "object",
  fields: [
    defineField({
      name: "leftContent",
      title: "Left Content",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rightContent",
      title: "Right Content",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "leftImage",
      title: "Left Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "rightImage",
      title: "Right Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "reverse",
      title: "Reverse Layout",
      type: "boolean",
      description: "Swap left and right columns",
      initialValue: false,
    }),
    defineField({
      name: "verticalAlignment",
      title: "Vertical Alignment",
      type: "string",
      options: {
        list: [
          { title: "Top", value: "top" },
          { title: "Center", value: "center" },
          { title: "Bottom", value: "bottom" },
        ],
      },
      initialValue: "top",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Two Column Block",
      };
    },
  },
});
