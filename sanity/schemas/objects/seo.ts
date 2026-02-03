import { defineType } from "sanity";

export default defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    {
      name: "title",
      title: "SEO-titel",
      type: "string",
      description:
        "Meta-titel för sökmotorer. Rekommenderat: 50-60 tecken. Om tomt används sidans titel.",
    },
    {
      name: "description",
      title: "SEO-beskrivning",
      type: "text",
      description:
        "Meta-beskrivning för sökmotorer. Rekommenderat: 150-160 tecken. Om tomt används sidans beskrivning.",
    },
    {
      name: "keywords",
      title: "SEO-nyckelord",
      type: "array",
      of: [{ type: "string" }],
      description: "Valfritt: lista med nyckelord separerade med kommatecken. Används för sökmotoroptimering.",
    },
    {
      name: "image",
      title: "SEO-bild",
      type: "image",
      options: {
        hotspot: true,
      },
      description:
        "Bild som används för social delning (Open Graph / Twitter-kort). Visas när sidan delas på sociala medier.",
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});
