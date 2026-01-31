import { defineField, defineType } from "sanity";

export const imageBlock = defineType({
  name: "block.image",
  title: "Bild",
  type: "object",
  groups: [{ name: "blockSettings", title: "Blockinställningar" }],
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "blockHeading",
    }),
    defineField({
      name: "image",
      title: "Bild",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt-text",
          type: "string",
          description: "Beskrivning av bilden för tillgänglighet och SEO. Viktigt för skärmläsare och sökmotorer.",
        },
      ],
    }),
    defineField({
      name: "caption",
      title: "Bildtext",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "aspectRatio",
      title: "Bildförhållande",
      description: "Förhållandet mellan bildens bredd och höjd. Auto använder bildens ursprungliga förhållande.",
      type: "string",
      options: {
        list: [
          { title: "16:9 (Landskap)", value: "16/9" },
          { title: "4:3", value: "4/3" },
          { title: "1:1 (Kvadrat)", value: "1/1" },
          { title: "9:16 (Porträtt)", value: "9/16" },
          { title: "Auto", value: "auto" },
        ],
      },
      initialValue: "auto",
    }),
  ],
  preview: {
    select: {
      title: "caption",
      media: "image",
    },
    prepare({ title, media }) {
      return {
        title: title || "Bildblock",
        subtitle: "Bild",
        media,
      };
    },
  },
});
