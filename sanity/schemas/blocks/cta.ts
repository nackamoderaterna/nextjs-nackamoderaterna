import { defineField, defineType } from "sanity";

export const ctaBlock = defineType({
  name: "block.cta",
  title: "Call-to-action",
  type: "object",
  fields: [
    defineField({
      name: "layout",
      title: "Layout",
      description: "Bredd på blocket. Full bredd (7xl) eller samma som textblock (3xl).",
      type: "string",
      options: {
        list: [
          { title: "Full bredd", value: "fullWidth" },
          { title: "Med textbredd", value: "contained" },
        ],
      },
      initialValue: "fullWidth",
    }),
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "blockHeading",
      validation: (Rule) =>
        Rule.required().custom((heading: { title?: string } | undefined) => {
          if (!heading || typeof heading !== "object" || !String(heading.title ?? "").trim())
            return "Titel krävs";
          return true;
        }),
    }),
    defineField({
      name: "primaryAction",
      title: "Primär knapp",
      description: "Huvudknappen som ska fånga användarens uppmärksamhet.",
      type: "buttonWithIcon",
    }),
    defineField({
      name: "secondaryAction",
      title: "Sekundär knapp",
      description: "Valfri sekundär knapp för alternativa åtgärder.",
      type: "buttonWithIcon",
    }),
    defineField({
      name: "alignment",
      title: "Justering",
      description: "Hur innehållet ska justeras horisontellt.",
      type: "string",
      options: {
        list: [
          { title: "Vänster", value: "left" },
          { title: "Centrerat", value: "center" },
          { title: "Höger", value: "right" },
        ],
      },
      initialValue: "center",
    }),
  ],
  preview: {
    select: {
      "headingTitle": "heading.title",
    },
    prepare(selection) {
      return {
        title: "Call-to-action",
        subtitle: selection.headingTitle,
      };
    },
  },
});
