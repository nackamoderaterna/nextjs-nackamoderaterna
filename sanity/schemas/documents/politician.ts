import { defineType } from "sanity";

export const politician = defineType({
  name: "politician",
  title: "Politiker",
  type: "document",
  groups: [
    { name: "base", title: "Bas" },
    { name: "uppdrag", title: "Uppdrag" },
  ],
  fields: [
    {
      name: "name",
      title: "Namn",
      type: "string",
      group: "base",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      description: "URL-vänlig identifierare för politikern. Genereras automatiskt från namnet. Används för att skapa politikerns sida.",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      group: "base",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "image",
      title: "Profilbild",
      description: "Profilbild som visas på politikerns sida och i listningar.",
      type: "image",
      group: "base",
      options: {
        hotspot: true,
      },
    },
    {
      name: "email",
      title: "E-post",
      description: "Kontakt-e-postadress för politikern.",
      type: "string",
      group: "base",
    },
    {
      name: "phone",
      title: "Telefon",
      description: "Telefonnummer för kontakt med politikern.",
      type: "string",
      group: "base",
    },
    {
      name: "bio",
      title: "Biografi",
      description: "Biografisk text om politikern. Visas på politikerns sida.",
      type: "array",
      group: "base",
      of: [{ type: "block" }],
    },
    {
      name: "kommunalrad",
      title: "Kommunalråd",
      type: "object",
      group: "uppdrag",
      fields: [
        {
          name: "active",
          title: "Aktiv",
          type: "boolean",
          initialValue: false,
        },
        {
          name: "role",
          title: "Roll",
          type: "string",
          options: {
            list: [
              {
                title: "Kommunstyrelsens ordförande",
                value: "president",
              },
              { title: "Kommunalråd", value: "ordinary" },
            ],
          },
          initialValue: "ordinary",
          hidden: ({ parent }) => !parent.active,
        },
      ],
    },
    {
      name: "partyBoard",
      title: "Styrelseuppdrag",
      type: "object",
      group: "uppdrag",
      fields: [
        {
          name: "active",
          title: "Aktiv",
          type: "boolean",
          initialValue: false,
        },
        {
          name: "title",
          title: "Titel",
          type: "string",
          description: "T.ex. Ordförande, Ledamot, Kassör",
          hidden: ({ parent }) => !parent?.active,
        },
        {
          name: "isLeader",
          title: "Är ordförande/ledare",
          type: "boolean",
          initialValue: false,
          hidden: ({ parent }) => !parent?.active,
        },
      ],
    },
    {
      name: "kommunfullmaktige",
      title: "Kommunfullmäktige",
      type: "object",
      group: "uppdrag",
      fields: [
        {
          name: "active",
          title: "Aktiv",
          type: "boolean",
          initialValue: false,
        },
        {
          name: "title",
          title: "Titel",
          type: "string",
          description: "T.ex. Ledamot, Gruppledare",
          hidden: ({ parent }) => !parent?.active,
        },
        {
          name: "role",
          title: "Ordinarie eller ersättare",
          type: "string",
          options: {
            list: [
              { title: "Ordinarie", value: "ordinary" },
              { title: "Ersättare", value: "substitute" },
            ],
          },
          initialValue: "ordinary",
          hidden: ({ parent }) => !parent?.active,
        },
      ],
    },

    {
      name: "namndPositions",
      title: "Nämnder",
      type: "array",
      of: [
        {
          name: "namndPosition",
          title: "Position",
          type: "object",
          fields: [
            {
              name: "namndRef",
              title: "Nämnd",
              type: "reference",
              to: [{ type: "namnd" }],
            },
            {
              name: "title",
              title: "Titel",
              type: "string",
              description: "T.ex. Ordförande, Ledamot, Ersättare",
            },
            {
              name: "isLeader",
              title: "Är ordförande/ledare",
              type: "boolean",
              initialValue: false,
            },
          ],
          preview: {
            select: {
              namndTitle: "namndRef.title",
              title: "title",
            },
            prepare({ namndTitle, title }) {
              return {
                title: namndTitle,
                subtitle: title || "–",
              };
            },
          },
        },
      ],
      group: "uppdrag",
    },
    {
      name: "livingArea",
      title: "Bor i",
      description: "Geografiskt område där politikern bor.",
      type: "reference",
      to: { type: "geographicalArea" },
    },
    {
      name: "politicalAreas",
      title: "Hjärtefrågor",
      type: "array",
      of: [
        {
          name: "politicalAreaReference",
          title: "Hjärtefråga",
          type: "object",
          fields: [
            {
              name: "politicalArea",
              title: "Hjärtefråga",
              type: "reference",
              to: [{ type: "politicalArea" }],
            },
            {
              name: "showOnPoliticalAreaPage",
              title: "Visa på hjärtefrågans sida",
              type: "boolean",
              description: "Om markerad visas politiken på hjärtefrågans sida. Annars visas den endast på politikerns sida.",
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: "politicalArea.name",
              showOnPage: "showOnPoliticalAreaPage",
            },
            prepare({ title, showOnPage }) {
              return {
                title: title || "–",
                subtitle: showOnPage ? "Syns på hjärtefrågans sida" : "Endast på politikerns sida",
              };
            },
          },
        },
      ],
    },
    {
      name: "socialMedia",
      title: "Sociala medier",
      type: "object",
      fields: [
        { name: "facebook", title: "Facebook", type: "url" },
        { name: "twitter", title: "Twitter/X", type: "url" },
        { name: "instagram", title: "Instagram", type: "url" },
        { name: "linkedin", title: "LinkedIn", type: "url" },
        { name: "tiktok", title: "TikTok", type: "url" },
      ],
      group: "base",
    },
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
