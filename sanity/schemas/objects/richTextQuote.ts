import { defineType, defineField } from "sanity";

export const richTextQuote = defineType({
  name: "richTextQuote",
  title: "Citat",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Citat",
      description: "Citattexten som ska visas.",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Namn",
      description: "Namn på personen som citeras.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Titel",
      description: "Valfritt: Titel eller roll för personen (t.ex. 'Ordförande', 'Kommunalråd').",
      type: "string",
    }),
    defineField({
      name: "link",
      title: "Länk",
      description: "Valfritt: Länk till personens sida eller profil.",
      type: "url",
    }),
  ],
  preview: {
    select: {
      name: "name",
      title: "title",
      quote: "quote",
    },
    prepare({ name, title, quote }) {
      const quoteText = quote || "Inget citat";
      const subtitle = title ? `${name}, ${title}` : name;
      return {
        title: quoteText.substring(0, 50) + (quoteText.length > 50 ? "..." : ""),
        subtitle: subtitle || "Citat",
      };
    },
  },
});
