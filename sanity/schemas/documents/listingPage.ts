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

