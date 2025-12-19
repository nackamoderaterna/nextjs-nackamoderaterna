import { defineType } from "sanity";

export const containerSettings = defineType({
  name: "containerSettings",
  title: "Container Settings",
  type: "object",
  options: { collapsible: true },
  fields: [
    {
      name: "containerWidth",
      title: "Container Width",
      type: "string",
      description:
        "Controls if the container can expand to the edge of the screen or not.",
      options: {
        list: [
          { title: "Full Width", value: "full" },
          { title: "Contained", value: "contained" },
        ],
      },
      initialValue: "contained",
    },
    {
      name: "blockPlacement",
      title: "Block Alignment",
      description: "Place the block inside the container",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "center",
      hidden: ({ parent }) => parent?.containerWidth === "full",
    },
  ],
});
