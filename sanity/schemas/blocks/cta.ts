import { defineField, defineType } from "sanity";

export const ctaBlock = defineType({
  name: "block.cta",
  title: "Call-to-action",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivning",
      type: "text",
    }),
    defineField({
      name: "primaryButton",
      title: "Primär knapp",
      description: "Huvudknappen som ska fånga användarens uppmärksamhet.",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Knapptext",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "link",
          title: "Länk",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "secondaryButton",
      title: "Sekundär knapp",
      description: "Valfri sekundär knapp för alternativa åtgärder.",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Knapptext",
          type: "string",
        }),
        defineField({
          name: "link",
          title: "Länk",
          type: "string",
        }),
      ],
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
      heading: "heading",
    },
    prepare(selection) {
      return {
        title: "Call-to-action",
        subtitle: selection.heading,
      };
    },
  },
});
