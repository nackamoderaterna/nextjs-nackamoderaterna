import { defineType } from "sanity";

export const eventDocument = defineType({
  name: "event",
  title: "Evenemang",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Titel",
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
      name: "startDate",
      title: "Startdatum",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "endDate",
      title: "Slutdatum",
      type: "datetime",
    },
    {
      name: "description",
      title: "Beskrivning",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "image",
      title: "Bild",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "location",
      title: "Plats",
      type: "object",
      fields: [
        { name: "venue", title: "Lokal", type: "string" },
        { name: "address", title: "Adress", type: "string" },
        { name: "city", title: "Stad", type: "string" },
      ],
    },
    {
      name: "eventType",
      title: "Typ av evenemang",
      type: "string",
      options: {
        list: [
          { title: "Möte", value: "meeting" },
          { title: "Konferens", value: "conference" },
          { title: "Kampanj", value: "campaign" },
          { title: "Övrigt", value: "other" },
        ],
      },
    },
    {
      name: "registrationUrl",
      title: "Anmälningslänk",
      type: "url",
    },
    {
      name: "geographicalArea",
      title: "Geografiskt område",
      type: "reference",
      to: [{ type: "geographicalArea" }],
    },
    {
      name: "isPublic",
      title: "Öppet för allmänheten",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "politicalAreas",
      title: "Politiska områden",
      type: "array",
      of: [{ type: "reference", to: [{ type: "politicalArea" }] }],
    },
  ],
  orderings: [
    {
      title: "Startdatum, kommande först",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "startDate",
      media: "image",
    },
  },
});
