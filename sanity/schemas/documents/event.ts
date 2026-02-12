import { defineField, defineType } from "sanity";
import { DateTimeInput } from "../components/DateTimeInput";

export const eventDocument = defineType({
  name: "event",
  title: "Evenemang",
  type: "document",
  groups: [
    { name: "content", title: "Innehåll" },
    { name: "when", title: "Tid" },
    { name: "where", title: "Plats" },
    { name: "settings", title: "Inställningar" },
    { name: "relations", title: "Relationer" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description:
        "URL-vänlig identifierare för evenemanget. Genereras automatiskt från titel och datum.",
      type: "slug",
      options: {
        source: (doc) => {
          const title = (doc.title as string) || "";
          const startDate = doc.startDate as string | undefined;
          if (!startDate) return title;
          const d = new Date(startDate);
          const dd = String(d.getDate()).padStart(2, "0");
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const yy = String(d.getFullYear()).slice(-2);
          return `${title}-${dd}-${mm}-${yy}`;
        },
        maxLength: 96,
      },
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivning",
      description: "Beskrivning av evenemanget. Visas på evenemangets sida.",
      type: "array",
      group: "content",
      of: [{ type: "block" }, { type: "image" }],
    }),
    defineField({
      name: "image",
      title: "Bild",
      description: "Bild som visas i listningar och på evenemangets sida.",
      type: "image",
      group: "content",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "startDate",
      title: "Startdatum",
      description: "Datum och tid när evenemanget börjar.",
      type: "datetime",
      group: "when",
      components: {
        input: DateTimeInput,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "Slutdatum",
      description:
        "Valfritt: datum och tid när evenemanget slutar. Om tomt är evenemanget en punkt i tiden.",
      type: "datetime",
      group: "when",
      components: {
        input: DateTimeInput,
      },
    }),
    defineField({
      name: "location",
      title: "Plats",
      description: "Var evenemanget äger rum.",
      type: "object",
      group: "where",
      fields: [
        {
          name: "venue",
          title: "Lokal",
          type: "string",
          description: "Namn på lokalen eller platsen.",
        },
        {
          name: "address",
          title: "Adress",
          type: "string",
          description: "Gatuadress.",
        },
        {
          name: "city",
          title: "Stad",
          type: "string",
          description: "Stad där evenemanget äger rum.",
        },
        {
          name: "mapsUrl",
          title: "Kartlänk",
          type: "url",
          description:
            "Valfritt: länk till Google Maps eller annan karttjänst. Om tom genereras en länk automatiskt från adressen.",
        },
      ],
    }),
    defineField({
      name: "eventType",
      title: "Typ av evenemang",
      description: "Kategoriserar evenemanget för filtrering och visning.",
      type: "reference",
      group: "settings",
      to: [{ type: "eventType" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "registrationUrl",
      title: "Anmälningslänk",
      description: "URL till anmälningssidan om anmälan krävs.",
      type: "url",
      group: "settings",
    }),
    defineField({
      name: "isPublic",
      title: "Öppet för allmänheten",
      description:
        "Om markerat är evenemanget öppet för allmänheten. Annars är det endast för medlemmar.",
      type: "boolean",
      group: "settings",
      initialValue: false,
    }),
    defineField({
      name: "geographicalArea",
      title: "Geografiskt område",
      description: "Valfritt: geografiskt område där evenemanget äger rum.",
      type: "reference",
      group: "relations",
      to: [{ type: "geographicalArea" }],
    }),
    defineField({
      name: "politicalAreas",
      title: "Politiska områden",
      description: "Politiska områden som evenemanget är relaterat till.",
      type: "array",
      group: "relations",
      of: [{ type: "reference", to: [{ type: "politicalArea" }] }],
    }),
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
