import { defineField, defineType } from "sanity";

export const heroBlock = defineType({
  name: "block.hero",
  title: "Hero",
  type: "object",
  groups: [{ name: "blockSettings", title: "Blockinställningar" }],
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subheading",
      title: "Underrubrik",
      type: "string",
    }),
    defineField({
      name: "backgroundImage",
      title: "Bakgrundsbild",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "overlayOpacity",
      title: "Överläggsopacitet (0-100)",
      description: "Hur genomskinlig det mörka överlägget ska vara. 0 = helt genomskinligt, 100 = helt ogenomskinligt.",
      type: "number",
      initialValue: 40,
    }),
    defineField({
      name: "ctaButton",
      title: "Knapp",
      description: "Call-to-action knapp som visas i hero-området.",
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
      name: "reflow",
      title: "Omslag vid små skärmar",
      description: "Om aktiverat kommer innehållet att omslås på små skärmar istället för att skalas ner.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "height",
      title: "Höjd",
      description: "Höjden på hero-området. Fullskärm tar upp hela skärmhöjden.",
      type: "string",
      options: {
        list: [
          { title: "Liten (400px)", value: "small" },
          { title: "Medium (600px)", value: "medium" },
          { title: "Stor (800px)", value: "large" },
          { title: "Fullskärm", value: "fullscreen" },
        ],
      },
      initialValue: "medium",
    }),
  ],
  preview: {
    select: {
      heading: "heading",
    },
    prepare(selection) {
      return {
        title: "Hero",
        subtitle: selection.heading,
      };
    },
  },
});
