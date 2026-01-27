import { defineField, defineType } from "sanity";

export const contactBlock = defineType({
  name: "block.contact",
  title: "Kontaktformulär",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "string",
      description: "Valfri rubrik för kontaktformuläret",
    }),
    defineField({
      name: "description",
      title: "Beskrivning",
      type: "text",
      description: "Valfri beskrivning som visas ovanför formuläret",
    }),
    defineField({
      name: "showContactInfo",
      title: "Visa kontaktuppgifter",
      description: "Visa kontaktuppgifter från globala inställningar bredvid formuläret",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      heading: "heading",
    },
    prepare(selection) {
      return {
        title: "Kontaktformulär",
        subtitle: selection.heading || "Ingen rubrik",
      };
    },
  },
});
