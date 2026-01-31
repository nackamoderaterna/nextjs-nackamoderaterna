import { defineField, defineType } from "sanity";

/**
 * Shared social links object. Define available platforms here once;
 * used in Global settings and on Politician documents.
 */
export default defineType({
  name: "socialLinks",
  title: "Sociala medier",
  type: "object",
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: "facebook",
      title: "Facebook",
      type: "url",
    }),
    defineField({
      name: "twitter",
      title: "Twitter / X",
      type: "url",
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "url",
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn",
      type: "url",
    }),
    defineField({
      name: "tiktok",
      title: "TikTok",
      type: "url",
    }),
  ],
});
