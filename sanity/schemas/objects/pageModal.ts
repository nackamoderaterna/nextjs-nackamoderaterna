import { defineField, defineType } from "sanity";

export default defineType({
  name: "pageModal",
  title: "Sid-modal",
  type: "object",
  fields: [
    defineField({
      name: "enabled",
      title: "Aktiverad",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "onLoadDelayMs",
      title: "Fördröjning (ms)",
      description: "Modalen öppnas automatiskt vid sidladdning.",
      type: "number",
      initialValue: 800,
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "frequency",
      title: "Visa hur ofta",
      type: "string",
      options: {
        list: [
          { title: "Varje gång", value: "always" },
          { title: "En gång per session", value: "oncePerSession" },
          { title: "En gång per dag", value: "oncePerDay" },
        ],
        layout: "radio",
      },
      initialValue: "oncePerSession",
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "storageKey",
      title: "Nyckel för “visad”-lagring",
      description:
        "Om tomt används sidans slug automatiskt. Ändra om du vill dela “visad”-status mellan flera sidor.",
      type: "string",
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "content",
      title: "Innehåll",
      type: "array",
      of: [{ type: "block" }],
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "primaryButton",
      title: "Primär knapp",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Text", type: "string" }),
        defineField({ name: "href", title: "Länk", type: "string" }),
      ],
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "secondaryButton",
      title: "Sekundär knapp",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Text", type: "string" }),
        defineField({ name: "href", title: "Länk", type: "string" }),
      ],
      hidden: ({ parent }) => !parent?.enabled,
    }),
  ],
});

