import { defineField, defineType } from "sanity";

export const politicalIssue = defineType({
  name: "politicalIssue",
  title: "Politisk Fråga",
  type: "document",
  groups: [
    { name: "content", title: "Innehåll" },
    { name: "relations", title: "Relationer" },
  ],
  fields: [
    defineField({
      name: "question",
      title: "Fråga",
      type: "text",
      rows: 3,
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Kort beskrivning",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "En koncis sammanfattning som visas på kort i listningar (t.ex. på politik- och sakfrågorsidorna). Håll texten kort och informativ—den ska ge läsaren en snabb överblick innan de klickar vidare.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description:
        "URL-vänlig identifierare. Genereras automatiskt från frågan.",
      type: "slug",
      options: {
        source: "question",
        maxLength: 96,
      },
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Innehåll",
      description: "Huvudinnehållet för frågans sida.",
      type: "array",
      group: "content",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "featured",
      title: "Framhävd",
      type: "boolean",
      description: "Visa denna fråga framträdande",
      group: "content",
      initialValue: false,
    }),
    defineField({
      name: "fulfilled",
      title: "Uppfyllt",
      type: "boolean",
      description: "Markera om detta vallöfte är uppfyllt",
      group: "content",
      initialValue: false,
    }),
    defineField({
      name: "fulfilledAt",
      title: "Uppfylld datum",
      type: "date",
      description:
        "När vallöftet uppfylldes. Visas i sidofältet när uppfyllt är markerat.",
      group: "content",
      hidden: ({ parent }) => !parent?.fulfilled,
    }),
    defineField({
      name: "politicalAreas",
      title: "Politiska områden",
      description:
        "Politiska områden som denna fråga tillhör. Minst ett område måste väljas.",
      type: "array",
      group: "relations",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "area",
              title: "Område",
              type: "reference",
              to: [{ type: "politicalArea" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "display",
              title: "Visa på kategorisida",
              description:
                "Om markerat visas denna sakfråga på kategorisidan för det valda området.",
              type: "boolean",
              initialValue: true,
            }),
          ],
          preview: {
            select: { title: "area.name", display: "display" },
            prepare({ title, display }) {
              return {
                title: title || "Okänt område",
                subtitle: display ? "Visas" : "Dold",
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "geographicalAreas",
      title: "Geografiska områden",
      description:
        "Valfritt: geografiska områden som denna fråga är relaterad till.",
      type: "array",
      group: "relations",
      of: [{ type: "reference", to: [{ type: "geographicalArea" }] }],
    }),
    defineField({
      name: "responsiblePoliticians",
      title: "Ansvariga politiker",
      description: "Valfritt: politiker som är ansvariga för denna fråga.",
      type: "array",
      group: "relations",
      of: [{ type: "reference", to: [{ type: "politician" }] }],
    }),
  ],
  preview: {
    select: {
      question: "question",
      featured: "featured",
    },
    prepare(selection: any) {
      const { question, featured } = selection;
      const truncated =
        question?.length > 80 ? question.substring(0, 80) + "..." : question;

      return {
        title: `${featured ? "⭐ " : ""}${truncated || "Ingen fråga"}`,
      };
    },
  },
});
