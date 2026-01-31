import { defineField, defineType } from "sanity";

export const contactBlock = defineType({
  name: "block.contact",
  title: "Kontaktformulär",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "blockHeading",
      description: "Valfri rubrik och beskrivning som visas ovanför formuläret",
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
      "headingTitle": "heading.title",
    },
    prepare(selection) {
      return {
        title: "Kontaktformulär",
        subtitle: selection.headingTitle || "Ingen rubrik",
      };
    },
  },
});
