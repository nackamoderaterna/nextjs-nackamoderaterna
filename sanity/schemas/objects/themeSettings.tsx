import { defineType } from "sanity";

export const themeSettings = defineType({
  name: "themeSettings",
  title: "Temainställningar",
  type: "object",
  options: { collapsible: true },
  fields: [
    {
      name: "theme",
      title: "Tema",
      description: "Färgtema för blocket. Brand använder partifärger.",
      type: "string",
      initialValue: "default",
      options: {
        list: [
          { title: "Ljust", value: "light" },
          { title: "Mörkt", value: "dark" },
          { title: "Partifärger", value: "brand" },
        ],
        layout: "radio",
      },
    },
  ],
});
