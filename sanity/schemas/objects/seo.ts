import { defineType } from "sanity";

export default defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    {
      name: "title",
      title: "SEO Title",
      type: "string",
      description:
        "Meta title for search engines. Recommended: 50-60 characters.",
    },
    {
      name: "description",
      title: "SEO Description",
      type: "text",
      description:
        "Meta description for search engines. Recommended: 150-160 characters.",
    },
    {
      name: "keywords",
      title: "SEO Keywords",
      type: "array",
      of: [{ type: "string" }],
      description: "Optional: list of keywords separated by commas.",
    },
    {
      name: "image",
      title: "SEO Image",
      type: "image",
      description:
        "Image used for social sharing (Open Graph / Twitter cards).",
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});
