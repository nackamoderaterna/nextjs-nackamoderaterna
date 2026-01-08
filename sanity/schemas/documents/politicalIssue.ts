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
      name: "politicalAreas",
      title: "Politiska områden",
      type: "array",
      of: [{ type: "reference", to: [{ type: "politicalArea" }] }],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: "geographicalAreas",
      title: "Geografiska områden",
      type: "array",
      of: [{ type: "reference", to: [{ type: "geographicalArea" }] }],
    },
    {
      name: "responsiblePoliticians",
      title: "Ansvariga politiker",
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
