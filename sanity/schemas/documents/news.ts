import { defineField, defineType } from "sanity";

export const news = defineType({
  name: "news",
  title: "Nyheter",
  type: "document",
  groups: [
    { name: "content", title: "Innehåll" },
    { name: "media", title: "Media" },
    { name: "relations", title: "Relationer" },
    { name: "metadata", title: "Metadata" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Rubrik",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description:
        "URL-vänlig identifierare för nyheten. Genereras automatiskt från rubriken.",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
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
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Ingress",
      description:
        "Kort sammanfattning som visas i listningar och förhandsvisningar.",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Innehåll",
      description:
        "Huvudinnehållet i nyheten. Kan innehålla text, bilder och annat innehåll.",
      type: "array",
      group: "content",
      validation: (Rule) => Rule.required().min(1),
      of: [
        { type: "block" },
        { type: "image" },
        { type: "richTextQuote" },
        { type: "richTextHighlightedLink" },
      ],
    }),
    defineField({
      name: "mainImage",
      title: "Huvudbild",
      description: "Huvudbild som visas i listningar och på nyhetens sida.",
      type: "image",
      group: "media",
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
        defineField({
          name: "aspectRatio",
          title: "Bildförhållande (sidebar)",
          description:
            "Förhållande i sidofältet. Porträtt (4:5) passar Instagram-inlägg. Kvadrat för kvadratiska bilder.",
          type: "string",
          options: {
            list: [
              { title: "Porträtt (4:5, Instagram)", value: "portrait" },
              { title: "Kvadrat (1:1)", value: "square" },
              { title: "Landskap (16:9)", value: "landscape" },
              { title: "Auto (ursprungligt)", value: "auto" },
            ],
          },
          initialValue: "portrait",
        }),
      ],
    }),
    defineField({
      name: "documents",
      title: "Bifogade dokument",
      description:
        "Valfria dokument (PDF, Word, etc.) som bifogas till nyheten.",
      type: "array",
      group: "media",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Visningsnamn",
              description: "Namnet som visas i sidomenyn.",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "file",
              title: "Fil",
              type: "file",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram-länk",
      description:
        "Länk till diskussionen på Instagram. Visar en knapp under bilden för att delta i diskussionen.",
      type: "url",
      group: "media",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook-länk",
      description:
        "Länk till diskussionen på Facebook. Visar en knapp under bilden för att delta i diskussionen.",
      type: "url",
      group: "media",
    }),
    defineField({
      name: "referencedPolitician",
      title: "Omnämnda politiker",
      description: "Politiker som nämns eller är relaterade till nyheten.",
      type: "array",
      group: "relations",
      of: [
        {
          name: "politician",
          title: "Politiker",
          type: "reference",
          to: [{ type: "politician" }],
        },
      ],
    }),
    defineField({
      name: "politicalAreas",
      title: "Politiska områden",
      description: "Politiska områden som nyheten är relaterad till.",
      type: "array",
      group: "relations",
      of: [{ type: "reference", to: [{ type: "politicalArea" }] }],
    }),
    defineField({
      name: "geographicalAreas",
      title: "Geografiska områden",
      description: "Geografiska områden som nyheten är relaterad till.",
      type: "array",
      group: "relations",
      of: [{ type: "reference", to: [{ type: "geographicalArea" }] }],
    }),
    defineField({
      name: "politicalIssues",
      title: "Politiska frågor",
      description: "Politiska frågor som nyheten är relaterad till.",
      type: "array",
      group: "relations",
      of: [{ type: "reference", to: [{ type: "politicalIssue" }] }],
    }),
    defineField({
      name: "articleSeries",
      title: "Artikelserie",
      description:
        "Koppla artikeln till en artikelserie. Alla artiklar i samma serie visas automatiskt i sidofältet.",
      type: "reference",
      group: "relations",
      to: [{ type: "articleSeries" }],
    }),
    defineField({
      name: "dateOverride",
      title: "Överskriv publiceringsdatum",
      description:
        "Ange datumet då artikeln publicerades för att överskrida systemets publiceringsdatum. Användbart om artikeln publicerades tidigare eller ska publiceras i framtiden.",
      type: "date",
      group: "metadata",
    }),
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
