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
          type: "boolean",
          initialValue: false,
        },
        {
          name: "role",
          title: "Role Type",
          type: "string",
          options: {
            list: [
              {
                name: "active",
                type: "boolean",
                initialValue: false,
              },
              {
                name: "role",
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
              },
            ],
          },
          initialValue: "ordinary",
          hidden: (Rule) => Rule.parent?.kommunalrad?.active,
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
          type: "boolean",
          initialValue: false,
        },
        {
          name: "position",
          title: "Position",
          type: "string",
          options: {
            list: [
              { title: "Ordförande", value: "ordforande" },
              { title: "Ledamot", value: "ledamot" },
            ],
          },
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
          type: "boolean",
          initialValue: false,
        },
        {
          name: "role",
          type: "string",
          options: {
            list: [
              { title: "Ledamot", value: "ordinary" },
              { title: "Ersättare", value: "substitute" },
            ],
          },
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
              initialValue: "member",
            },
          ],
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
