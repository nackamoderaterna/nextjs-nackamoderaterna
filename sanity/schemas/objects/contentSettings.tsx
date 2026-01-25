import { defineType } from "sanity";

export const contentSettings = defineType({
  name: "contentSettings",
  title: "Innehållsinställningar",
  type: "object",
  options: { collapsible: true },
  fields: [
    {
      name: "contentWidth",
      title: "Innehållsbredd",
      description: "Kontrollerar bredden på innehållet i blocket. Full bredd använder hela containern, smal begränsar till en smal kolumn.",
      type: "string",
      options: {
        list: [
          { title: "Full bredd", value: "full" },
          { title: "Bred", value: "wide" },
          { title: "Smal", value: "narrow" },
        ],
      },
    },
    {
      name: "contentAlignment",
      title: "Justeringsläge",
      description: "Justerar innehållet horisontellt inom blocket.",
      type: "string",
      options: {
        list: [
          { title: "Vänster", value: "left" },
          { title: "Centrerat", value: "center" },
          { title: "Höger", value: "right" },
        ],
        layout: "radio",
      },
    },
  ],
});
