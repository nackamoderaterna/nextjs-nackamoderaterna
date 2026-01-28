import { defineType } from "sanity";

export const news = defineType({
  name: "news",
  title: "Nyheter",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Rubrik",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      description: "URL-vänlig identifierare för nyheten. Genereras automatiskt från rubriken.",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "variant",
      title: "Typ av nyhet",
      description: "Kategoriserar nyheten för att visa rätt layout och stil.",
      type: "string",
      options: {
        list: [
          { value: "default", title: "Nyhet" },
          { value: "debate", title: "Debattartikel" },
          { value: "pressrelease", title: "Pressmeddelande" },
        ],
      },
      initialValue: "default",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "excerpt",
      title: "Ingress",
      description: "Kort sammanfattning som visas i listningar och förhandsvisningar.",
      type: "text",
      rows: 3,
    },
    {
      name: "mainImage",
      title: "Huvudbild",
      description: "Huvudbild som visas i listningar och på nyhetens sida.",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt-text",
          description: "Beskrivning av bilden för tillgänglighet och SEO.",
          type: "string",
        },
      ],
    },
    {
      name: "body",
      title: "Innehåll",
      description: "Huvudinnehållet i nyheten. Kan innehålla text, bilder och annat innehåll.",
      type: "array",
      of: [
        { type: "block" },
        { type: "image" },
        { type: "richTextQuote" },
        { type: "richTextHighlightedLink" },
      ],
    },
    {
      name: "document",
      title: "Dokument",
      description: "Valfritt: bifoga ett dokument (PDF, Word, etc.) till nyheten.",
      type: "file",
    },
    {
      name: "referencedPolitician",
      title: "Omnämnda politiker",
      description: "Politiker som nämns eller är relaterade till nyheten.",
      type: "array",
      of: [
        {
          name: "politician",
          title: "Politiker",
          type: "reference",
          to: [{ type: "politician" }],
        },
      ],
    },
    {
      name: "politicalAreas",
      title: "Politiska områden",
      description: "Politiska områden som nyheten är relaterad till.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "politicalArea" }] }],
    },
    {
      name: "geographicalAreas",
      title: "Geografiska områden",
      description: "Geografiska områden som nyheten är relaterad till.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "geographicalArea" }] }],
    },
    {
      name: "articleSeries",
      title: "Artikelserie",
      description:
        "Koppla artikeln till en artikelserie. Alla artiklar i samma serie visas automatiskt i sidofältet.",
      type: "reference",
      to: [{ type: "articleSeries" }],
    },
    {
      name: "dateOverride",
      title: "Överskriv publiceringsdatum",
      description:
        "Ange datumet då artikeln publicerades för att överskrida systemets publiceringsdatum. Användbart om artikeln publicerades tidigare eller ska publiceras i framtiden.",
      type: "date",
    },
  ],
  orderings: [
    {
      title: "Publiceringsdatum (med override)",
      name: "effectiveDateDesc",
      by: [
        { field: "dateOverride", direction: "desc" },
        { field: "_createdAt", direction: "desc" },
      ],
    },
    {
      title: "Publiceringsdatum (stigande)",
      name: "effectiveDateAsc",
      by: [
        { field: "dateOverride", direction: "asc" },
        { field: "_createdAt", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "publishedAt",
      media: "mainImage",
    },
  },
});
