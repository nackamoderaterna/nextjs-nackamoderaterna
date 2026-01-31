import { defineField, defineType } from "sanity";

const IMAGE_HEIGHT_OPTIONS = [
  { title: "Liten (400px)", value: "small" },
  { title: "Medium (600px)", value: "medium" },
  { title: "Stor (800px)", value: "large" },
  { title: "Fullskärm (100vh)", value: "fullscreen" },
];

export default defineType({
  name: "pageHeader",
  title: "Sidhuvud",
  type: "object",
  fields: [
    defineField({
      name: "header",
      title: "Visningsrubrik",
      description:
        "Rubrik som visas i sidhuvudet. Lämna tom för att använda sidans titel.",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Beskrivning",
      description:
        "Kort beskrivning som visas i sidhuvudet. Används också som fallback för SEO om ingen SEO-beskrivning anges.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Bakgrundsbild",
      description:
        "Valfri bakgrundsbild. Om ingen bild väljs visas endast rubrik och beskrivning.",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "imageHeight",
      title: "Bildhöjd",
      description: "Höjden på bakgrundsbilden.",
      type: "string",
      options: {
        list: IMAGE_HEIGHT_OPTIONS,
        layout: "radio",
      },
      initialValue: "medium",
      hidden: ({ parent }) => !parent?.image,
    }),
    defineField({
      name: "overlayOpacity",
      title: "Överläggsopacitet (0-100)",
      description:
        "Hur mörkt överlägget på bakgrundsbilden ska vara för att göra texten läsbar.",
      type: "number",
      initialValue: 40,
      hidden: ({ parent }) => !parent?.image,
    }),
    defineField({
      name: "ctaButton",
      title: "CTA-knapp",
      description: "Valfri knapp i sidhuvudet (t.ex. \"Läs mer\", \"Kontakta oss\").",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Knapptext",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "href",
          title: "Länk",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
});
