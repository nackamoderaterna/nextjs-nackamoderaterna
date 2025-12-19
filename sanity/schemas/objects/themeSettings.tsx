import { defineType } from "sanity";

export const themeSettings = defineType({
  name: "themeSettings",
  title: "Theme Settings",
  type: "object",
  options: { collapsible: true },
  fields: [
    {
      name: "theme",
      title: "Theme",
      type: "string",
      initialValue: "default",
      options: {
        list: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
          { title: "Brand", value: "brand" },
        ],
        layout: "radio",
      },
    },
  ],
});
