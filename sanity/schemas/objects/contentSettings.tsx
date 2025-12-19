import { defineType } from "sanity";

export const contentSettings = defineType({
  name: "contentSettings",
  title: "Content Settings",
  type: "object",
  options: { collapsible: true },
  fields: [
    {
      name: "contentWidth",
      title: "Content Width",
      description: "Controls the width of the content of the block.",
      type: "string",
      options: {
        list: [
          { title: "Full Width", value: "full" },
          { title: "Wide", value: "wide" },
          { title: "Narrow", value: "narrow" },
        ],
      },
    },
    {
      name: "contentAlignment",
      title: "Alignment Mode",
      description: "Align the content inside the block",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
    },
  ],
});
