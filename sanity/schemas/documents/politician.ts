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
      type: "image",
      group: "base",
      options: {
        hotspot: true,
      },
    },
    {
      name: "email",
      title: "E-post",
      type: "string",
      group: "base",
    },
    {
      name: "phone",
      title: "Telefon",
      type: "string",
      group: "base",
    },
    {
      name: "bio",
      title: "Biografi",
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
          name: "position",
          title: "Roll",
          type: "string",
          options: {
            list: [
              { title: "Ordförande", value: "ordforande" },
              { title: "Ledamot", value: "ledamot" },
            ],
          },
          initialValue: "ledamot",
          hidden: ({ parent }) => !parent.active,
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
          name: "role",
          title: "Roll",
          type: "string",
          options: {
            list: [
              { title: "Ledamot", value: "ordinary" },
              { title: "Ersättare", value: "substitute" },
            ],
          },
          initialValue: "ordinary",
          hidden: ({ parent }) => !parent.active,
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
              name: "position",
              title: "Position",
              type: "string",
              options: {
                list: [
                  { title: "Ordförande", value: "president" },
                  { title: "1:e vice ordförande", value: "first-president" },
                  { title: "2:e vice ordförande", value: "second-president" },
                  { title: "Gruppledare", value: "groupleader" },
                  { title: "Ledamot", value: "member" },
                  { title: "Ersättare", value: "replacement" },
                ],
              },
            },
          ],
          preview: {
            select: {
              title: "namndRef.title",
              subtitle: "position",
            },
            prepare({ title, subtitle }) {
              const positionTitles = {
                president: "Ordförande",
                "first-president": "1:e vice ordförande",
                "second-president": "2:e vice ordförande",
                groupleader: "Gruppledare",
                member: "Ledamot",
                replacement: "Ersättare",
              };

              return {
                title,
                subtitle:
                  positionTitles[subtitle as keyof typeof positionTitles] ||
                  subtitle,
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
      type: "reference",
      to: { type: "geographicalArea" },
    },
    {
      name: "politicalAreas",
      title: "Hjärtefrågor",
      type: "array",
      of: [{ type: "reference", to: [{ type: "politicalArea" }] }],
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
