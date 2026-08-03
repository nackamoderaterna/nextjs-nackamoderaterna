import { defineField, defineType } from "sanity";

export default defineType({
  name: "buttonWithIcon",
  title: "Knapp",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Knapptext",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "linkType",
      title: "Länktyp",
      description: "Intern sökväg på nackamoderaterna.se, eller extern webbadress.",
      type: "string",
      options: {
        list: [
          { title: "Intern", value: "internal" },
          { title: "Extern", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
    }),
    defineField({
      name: "href",
      title: "Länk",
      description: "Relativ sökväg, t.ex. /kontakt",
      type: "string",
      hidden: ({ parent }) => parent?.linkType === "external",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { linkType?: string } | undefined;
          if (parent?.linkType === "external") return true;
          return value ? true : "Länk krävs";
        }),
    }),
    defineField({
      name: "externalUrl",
      title: "Extern webbadress",
      description: "Måste börja med http:// eller https://",
      type: "url",
      hidden: ({ parent }) => parent?.linkType !== "external",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { linkType?: string } | undefined;
          if (parent?.linkType !== "external") return true;
          if (!value) return "Webbadress krävs";
          return true;
        }).uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "icon",
      title: "Ikon (valfri)",
      type: "lucideIcon",
      description: "Visas före knapptexten",
    }),
  ],
  preview: {
    select: { label: "label", icon: "icon.name" },
    prepare({ label, icon }: { label?: string; icon?: string }) {
      return {
        title: label || "Knapp",
        subtitle: icon ? `Ikon: ${icon}` : undefined,
      };
    },
  },
});
