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
      name: "mode",
      title: "Läge",
      type: "string",
      initialValue: "byCategory",
      options: {
        list: [
          { value: "manual", title: "Manuellt urval" },
          { value: "allFeatured", title: "Alla kärnfrågor" },
          { value: "byCategory", title: "Filtrera på kategori" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "items",
      title: "Manuellt valda sakfrågor",
      type: "array",
      of: [{ type: "reference", to: [{ type: "politicalIssue" }] }],
      hidden: ({ parent }) => parent?.mode !== "manual",
    }),
    defineField({
      name: "politicalArea",
      title: "Filtrera på kategori",
      description: "Valfritt: visa endast sakfrågor från en viss kategori",
      type: "reference",
      to: [{ type: "politicalArea" }],
      hidden: ({ parent }) => parent?.mode !== "byCategory",
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
      hidden: ({ parent }) => parent?.mode !== "byCategory",
    }),
    defineField({
      name: "limit",
      title: "Max antal",
      description: "Begränsa hur många sakfrågor som visas (lämna tomt för alla)",
      type: "number",
      validation: (Rule) => Rule.min(1).max(50),
      hidden: ({ parent }) => parent?.mode === "manual",
    }),
  ],
  preview: {
    select: {
      headingTitle: "heading.title",
      mode: "mode",
      areaName: "politicalArea.name",
      filter: "filter",
      itemsCount: "items.length",
    },
    prepare({
      headingTitle,
      mode,
      areaName,
      filter,
      itemsCount,
    }: {
      headingTitle?: string;
      mode?: string;
      areaName?: string;
      filter?: string;
      itemsCount?: number;
    }) {
      if (mode === "manual") {
        return {
          title: "Sakfrågor",
          subtitle: headingTitle || `Manuellt urval (${itemsCount || 0} st)`,
        };
      }
      if (mode === "allFeatured") {
        return {
          title: "Sakfrågor",
          subtitle: headingTitle || "Alla kärnfrågor",
        };
      }
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
