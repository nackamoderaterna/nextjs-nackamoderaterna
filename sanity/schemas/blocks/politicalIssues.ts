import { defineField, defineType } from "sanity";

export const politicalIssuesBlock = defineType({
  name: "block.politicalIssues",
  title: "Sakfrågor",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "blockHeading",
    }),
    defineField({
      name: "politicalArea",
      title: "Filtrera på kategori",
      description: "Valfritt: visa endast sakfrågor från en viss kategori",
      type: "reference",
      to: [{ type: "politicalArea" }],
    }),
    defineField({
      name: "filter",
      title: "Filter",
      description: "Vilka sakfrågor ska visas",
      type: "string",
      options: {
        list: [
          { title: "Alla", value: "all" },
          { title: "Endast kärnfrågor", value: "featured" },
          { title: "Endast genomförda", value: "fulfilled" },
          { title: "Endast ej genomförda", value: "unfulfilled" },
        ],
      },
      initialValue: "all",
    }),
    defineField({
      name: "limit",
      title: "Max antal",
      description: "Begränsa hur många sakfrågor som visas (lämna tomt för alla)",
      type: "number",
      validation: (Rule) => Rule.min(1).max(50),
    }),
  ],
  preview: {
    select: {
      headingTitle: "heading.title",
      areaName: "politicalArea.name",
      filter: "filter",
    },
    prepare({
      headingTitle,
      areaName,
      filter,
    }: {
      headingTitle?: string;
      areaName?: string;
      filter?: string;
    }) {
      const filterLabels: Record<string, string> = {
        all: "alla",
        featured: "kärnfrågor",
        fulfilled: "genomförda",
        unfulfilled: "ej genomförda",
      };
      const filterLabel = filter ? filterLabels[filter] || filter : "alla";
      return {
        title: "Sakfrågor",
        subtitle: headingTitle || `${areaName ? areaName + " - " : ""}${filterLabel}`,
      };
    },
  },
});
