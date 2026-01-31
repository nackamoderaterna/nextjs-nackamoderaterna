import { defineField, defineType } from "sanity";

export const imageGalleryBlock = defineType({
  name: "block.imageGallery",
  title: "Bildgalleri",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "blockHeading",
    }),
    defineField({
      name: "images",
      title: "Bilder",
      description: "Samling av bilder som visas i ett galleri.",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alt-text",
              type: "string",
              description: "Beskrivning av bilden för tillgänglighet.",
            }),
            defineField({
              name: "caption",
              title: "Bildtext",
              type: "string",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "columns",
      title: "Kolumner",
      description: "Antal kolumner för att visa bilderna i galleriet.",
      type: "number",
      options: {
        list: [
          { title: "2 kolumner", value: 2 },
          { title: "3 kolumner", value: 3 },
          { title: "4 kolumner", value: 4 },
        ],
      },
      initialValue: 3,
    }),
    defineField({
      name: "aspectRatio",
      title: "Bildförhållande",
      description: "Förhållandet mellan bildernas bredd och höjd. Auto använder bildernas ursprungliga förhållande.",
      type: "string",
      options: {
        list: [
          { title: "Kvadrat (1:1)", value: "square" },
          { title: "Landskap (16:9)", value: "landscape" },
          { title: "Porträtt (4:5)", value: "portrait" },
          { title: "Auto", value: "auto" },
        ],
      },
      initialValue: "square",
    }),
  ],
  preview: {
    select: {
      "headingTitle": "heading.title",
      images: "images",
    },
    prepare({ headingTitle, images }) {
      return {
        title: "Bildgalleri",
        subtitle: headingTitle || `${images?.length || 0} bilder`,
      };
    },
  },
});
