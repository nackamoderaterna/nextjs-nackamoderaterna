import { defineField, defineType } from "sanity";

export const listingPage = defineType({
  name: "listingPage",
  title: "Listingsidor",
  type: "document",
  groups: [
    { name: "content", title: "Innehåll", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "key",
      title: "Sida",
      type: "string",
      description: "Vilken katalogsida dessa texter gäller.",
      group: "content",
      options: {
        list: [
          { title: "Politiker", value: "politicians" },
          { title: "Vår politik", value: "politics" },
          { title: "Politiska kategorier", value: "politikKategori" },
          { title: "Geografiska områden", value: "politikOmrade" },
          { title: "Våra sakfrågor", value: "politikSakfragor" },
          { title: "Nyheter", value: "news" },
          { title: "Evenemang", value: "events" },
          { title: "Kontakt", value: "contact" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Sidrubrik",
      type: "string",
      description: "Rubriken som visas högst upp på sidan.",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Ingress / introduktion",
      type: "text",
      rows: 4,
      group: "content",
      description:
        "En kort text som visas överst på sidan. Endast enkel text, inga bilder eller länkar.",
    }),
    defineField({
      name: "sectionTitles",
      title: "Sektionsrubriker",
      type: "object",
      group: "content",
      description: "Anpassa rubrikerna för olika sektioner på sidan. Lämna tomt för standardvärden.",
      fields: [
        // Politik page sections
        {
          name: "featuredIssues",
          title: "Kärnfrågor",
          type: "string",
          hidden: ({ document }) => document?.key !== "politics",
        },
        {
          name: "categories",
          title: "Kategorier",
          type: "string",
          hidden: ({ document }) => document?.key !== "politics",
        },
        {
          name: "areas",
          title: "Områden",
          type: "string",
          hidden: ({ document }) => document?.key !== "politics",
        },
        {
          name: "fulfilledPromises",
          title: "Uppfyllda vallöften",
          type: "string",
          hidden: ({ document }) => document?.key !== "politics",
        },
        // Events page sections
        {
          name: "upcoming",
          title: "Kommande",
          type: "string",
          hidden: ({ document }) => document?.key !== "events",
        },
        {
          name: "past",
          title: "Tidigare",
          type: "string",
          hidden: ({ document }) => document?.key !== "events",
        },
        // Politicians page sections
        {
          name: "kommunalrad",
          title: "Kommunalråd",
          type: "string",
          hidden: ({ document }) => document?.key !== "politicians",
        },
        {
          name: "groupLeaders",
          title: "Gruppledare",
          type: "string",
          hidden: ({ document }) => document?.key !== "politicians",
        },
        {
          name: "partyBoard",
          title: "Föreningsstyrelsen",
          type: "string",
          hidden: ({ document }) => document?.key !== "politicians",
        },
        {
          name: "kommunfullmaktige",
          title: "Kommunfullmäktige",
          type: "string",
          hidden: ({ document }) => document?.key !== "politicians",
        },
        {
          name: "otherPoliticians",
          title: "Övriga politiker",
          type: "string",
          hidden: ({ document }) => document?.key !== "politicians",
        },
        // Sakfrågor page sections
        {
          name: "sakfragorFeatured",
          title: "Kärnfrågor",
          type: "string",
          hidden: ({ document }) => document?.key !== "politikSakfragor",
        },
        {
          name: "sakfragorFulfilled",
          title: "Genomförda vallöften",
          type: "string",
          hidden: ({ document }) => document?.key !== "politikSakfragor",
        },
        {
          name: "sakfragorAll",
          title: "Sakfrågor",
          type: "string",
          hidden: ({ document }) => document?.key !== "politikSakfragor",
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
      description:
        "Sökmotoroptimering för sidan. Om fält lämnas tomma används standardvärden.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "key",
    },
  },
});

