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
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "excerpt",
      title: "Ingress",
      type: "text",
      rows: 3,
    },
    {
      name: "mainImage",
      title: "Huvudbild",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt-text",
          type: "string",
        },
      ],
    },
    {
      name: "body",
      title: "Innehåll",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    },
    {
      name: "referencedPolitician",
      title: "Omnämnda politiker",
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
      type: "array",
      of: [{ type: "reference", to: [{ type: "politicalArea" }] }],
    },
    {
      name: "geographicalAreas",
      title: "Geografiska områden",
      type: "array",
      of: [{ type: "reference", to: [{ type: "geographicalArea" }] }],
    },
    {
      name: "related",
      title: "Nyhetsserie",
      type: "array",
      of: [{ type: "reference", to: [{ type: "news" }] }],
    },
    {
      name: "dateOverride",
      title: "Override publiceringsdatum",
      description:
        "Ange datumet då artikeln publicerades för att överskrida publiceringsdatumet. Bra om artikeln publicerats i dåtiden.",
      type: "date",
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
