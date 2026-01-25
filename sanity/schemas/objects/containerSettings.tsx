import { defineType } from "sanity";

export const containerSettings = defineType({
  name: "containerSettings",
  title: "Containerinställningar",
  type: "object",
  options: { collapsible: true },
  fields: [
    {
      name: "containerWidth",
      title: "Containerbredd",
      type: "string",
      description:
        "Kontrollerar om containern kan expandera till skärmens kant eller begränsas till en maxbredd.",
      options: {
        list: [
          { title: "Full bredd", value: "full" },
          { title: "Begränsad", value: "contained" },
        ],
      },
      initialValue: "contained",
    },
    {
      name: "blockPlacement",
      title: "Blockjustering",
      description: "Placerar blocket inom containern. Endast synligt när containerbredden inte är full.",
      type: "string",
      options: {
        list: [
          { title: "Vänster", value: "left" },
          { title: "Centrerat", value: "center" },
          { title: "Höger", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "center",
      hidden: ({ parent }) => parent?.containerWidth === "full",
    },
  ],
});
