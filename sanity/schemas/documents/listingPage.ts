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
        { name: "featuredIssues", title: "Kärnfrågor (Politik)", type: "string" },
        { name: "categories", title: "Kategorier (Politik)", type: "string" },
        { name: "areas", title: "Områden (Politik)", type: "string" },
        { name: "fulfilledPromises", title: "Uppfyllda vallöften (Politik)", type: "string" },
        // Events page sections
        { name: "upcoming", title: "Kommande (Evenemang)", type: "string" },
        { name: "past", title: "Tidigare (Evenemang)", type: "string" },
        // Politicians page sections
        { name: "kommunalrad", title: "Kommunalråd (Politiker)", type: "string" },
        { name: "groupLeaders", title: "Gruppledare (Politiker)", type: "string" },
        { name: "partyBoard", title: "Föreningsstyrelsen (Politiker)", type: "string" },
        { name: "kommunfullmaktige", title: "Kommunfullmäktige (Politiker)", type: "string" },
        { name: "otherPoliticians", title: "Övriga politiker (Politiker)", type: "string" },
        // Sakfrågor page sections
        { name: "sakfragorFeatured", title: "Kärnfrågor (Sakfrågor)", type: "string" },
        { name: "sakfragorFulfilled", title: "Genomförda vallöften (Sakfrågor)", type: "string" },
        { name: "sakfragorAll", title: "Sakfrågor (Sakfrågor)", type: "string" },
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

