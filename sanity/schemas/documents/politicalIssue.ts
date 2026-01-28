import { defineType } from "sanity";

// schemas/documents/politicalIssue.ts
export const politicalIssue = defineType({
  name: "politicalIssue",
  title: "Politisk Fråga",
  type: "document",
  fields: [
    {
      name: "question",
      title: "Fråga",
      type: "text",
      rows: 3,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "featured",
      title: "Framhävd",
      type: "boolean",
      description: "Visa denna fråga framträdande",
      initialValue: false,
    },
    {
      name: "fulfilled",
      title: "Uppfyllt",
      type: "boolean",
      description: "Markera om detta vallöfte är uppfyllt",
      initialValue: false,
    },
    {
      name: "politicalAreas",
      title: "Politiska områden",
      description: "Politiska områden som denna fråga tillhör. Minst ett område måste väljas.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "politicalArea" }] }],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: "geographicalAreas",
      title: "Geografiska områden",
      description: "Valfritt: geografiska områden som denna fråga är relaterad till.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "geographicalArea" }] }],
    },
    {
      name: "responsiblePoliticians",
      title: "Ansvariga politiker",
      description: "Valfritt: politiker som är ansvariga för denna fråga.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "politician" }] }],
    },
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
